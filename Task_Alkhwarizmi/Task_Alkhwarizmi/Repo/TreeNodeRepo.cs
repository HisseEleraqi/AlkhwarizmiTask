using MongoDB.Driver;
using Task_Alkhwarizmi.IRepo;
using Task_Alkhwarizmi.model;
using static Task_Alkhwarizmi.Repo.TreeNodeRepo;

namespace Task_Alkhwarizmi.Repo
{
    public class TreeNodeRepo : ITreeNodeRepo
    {
       
            private readonly IMongoCollection<TreeNode> _collection;


        public TreeNodeRepo(IMongoDatabase database)
            {
                _collection = database.GetCollection<TreeNode>("nodes");
            }

            

            public async Task<List<TreeNode>> GetAllAsync()
            {
                try
                {
                    return await _collection.Find(node => true).ToListAsync();
                }
                catch (Exception ex)
                {
                    // Log the exception (not shown here for brevity)
                    throw new Exception("Failed to retrieve all nodes.", ex);
                }
            }

            public async Task<TreeNode> GetByIdAsync(string id)
            {
                try
                {
                    return await _collection.Find(node => node.Id == id).FirstOrDefaultAsync();
                }
                catch (Exception ex)
                {
                    // Log the exception (not shown here for brevity)
                    throw new Exception($"Failed to retrieve node with id {id}.", ex);
                }
            }

            public async Task CreateAsync(TreeNode node)
            {
                try
                {
                    await _collection.InsertOneAsync(node);
                }
                catch (Exception ex)
                {
                    // Log the exception (not shown here for brevity)
                    throw new Exception("Failed to create node.", ex);
                }
            }

            public async Task UpdateAsync(string id, TreeNode node)
            {
                try
                {
                    var result = await _collection.ReplaceOneAsync(n => n.Id == id, node);
                    if (result.MatchedCount == 0)
                    {
                        throw new Exception($"No node found with id {id} to update.");
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception (not shown here for brevity)
                    throw new Exception($"Failed to update node with id {id}.", ex);
                }
            }

            public async Task DeleteAsync(string id)
            {
                try
                {
                    var result = await _collection.DeleteOneAsync(n => n.Id == id);
                    if (result.DeletedCount == 0)
                    {
                        throw new Exception($"No node found with id {id} to delete.");
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception (not shown here for brevity)
                    throw new Exception($"Failed to delete node with id {id}.", ex);
                }
            }
    }
}


