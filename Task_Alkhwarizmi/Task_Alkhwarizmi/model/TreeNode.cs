using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Task_Alkhwarizmi.model
{
    public class TreeNode {
        [Required]

        public string Id { get; set; }

        public string? ParentId { get; set; }
        [Required]
        public string Name { get; set; }

        public List<TreeNode> Children { get; set; }


    }
}
