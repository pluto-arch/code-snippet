using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace BlazorChatGptOutPutDemo.Models
{
    public class BaseModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;


        protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }


        protected bool SetProperty<T>(ref T field, T value)
        {
            if (EqualityComparer<T>.Default.Equals(field, value)) return false;

            field = value;
            OnPropertyChanged();
            return true;
        }
    }
}
