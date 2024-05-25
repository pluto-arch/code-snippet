namespace BlazorChatGptOutPutDemo.Models
{
    public class Message : BaseModel
    {
        private string _content;
        private bool _isLoading;

        public Message()
        {
            Id = Guid.NewGuid().ToString();
        }

        public string Id { get; set; }

        public string Content
        {
            get => _content;
            set => SetProperty(ref _content, value);
        }

        public bool IsLoading
        {
            get => _isLoading;
            set => SetProperty(ref _isLoading, value);
        }
    }
}
