using Task_Alkhwarizmi.model;

namespace Task_Alkhwarizmi.IRepo
{
    public interface ITreeNodeRepo
    {
        Task<List<TreeNode>> GetAllAsync();
        Task<TreeNode> GetByIdAsync(string id);
        Task CreateAsync(TreeNode node);
        Task UpdateAsync(string id, TreeNode node);
        Task DeleteAsync(string id);
    }
}
