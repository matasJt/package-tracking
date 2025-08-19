namespace Application.Services;

public class ResultSerivce<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }

    public static ResultSerivce<T> Ok(string? message,T data) =>
        new ResultSerivce<T> { Success = true, Message = message, Data = data };

    public static ResultSerivce<T> Fail(string message) =>
        new ResultSerivce<T> { Success = false, Message = message };
}