using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using Task_Alkhwarizmi.model;

namespace Task_Alkhwarizmi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreeNodeController : ControllerBase
    {
        private readonly IMongoCollection<TreeNode> _treeNodes;

        public TreeNodeController(IMongoDatabase database)
        {
            _treeNodes = database.GetCollection<TreeNode>("TreeNodes");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TreeNode>>> Get()
        {
            var treeNodes = await _treeNodes.Find(node => true).ToListAsync();
            return Ok(treeNodes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNode([FromBody] TreeNode node)
        {
            if (node == null || !ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // If the node has a parentId, add it under the parent node
            if (!string.IsNullOrEmpty(node.ParentId))
            {
                var parentNode = await _treeNodes.Find(n => n.Id == node.ParentId).FirstOrDefaultAsync();
                if (parentNode != null)
                {
                    parentNode.Children.Add(node);
                    await _treeNodes.ReplaceOneAsync(n => n.Id == parentNode.Id, parentNode);
                    return Ok();
                }
                else
                {
                    return BadRequest("Parent node not found");
                }
            }
            else
            {
                await _treeNodes.InsertOneAsync(node);
                return Ok();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] TreeNode treeNode)
        {
            var existingNode = await _treeNodes.Find(node => node.Id == id).FirstOrDefaultAsync();
            if (existingNode == null)
            {
                return NotFound();
            }

            // Update the parent ID in all child nodes
            var updateFilter = Builders<TreeNode>.Filter.Eq("ParentId", existingNode.Id);
            var updateDefinition = Builders<TreeNode>.Update.Set("ParentId", treeNode.Id);
            await _treeNodes.UpdateManyAsync(updateFilter, updateDefinition);

            // Ensure children are properly updated in the node
            foreach (var child in treeNode.Children)
            {
                child.ParentId = treeNode.Id;
            }

            await _treeNodes.ReplaceOneAsync(node => node.Id == id, treeNode);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingNode = await _treeNodes.Find(node => node.Id == id).FirstOrDefaultAsync();
            if (existingNode == null)
            {
                return NotFound();
            }

            // Check for child nodes
            var childNodes = await _treeNodes.Find(node => node.ParentId == id).ToListAsync();
            if (childNodes.Count > 0)
            {
                return Conflict(new { message = $"Node {id} is a parent of other nodes." });
            }

            await _treeNodes.DeleteOneAsync(node => node.Id == id);
            return NoContent();
        }
    }
}
