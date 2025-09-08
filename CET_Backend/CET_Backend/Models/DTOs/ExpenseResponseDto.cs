public class ExpenseResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Notes { get; set; }
    public decimal Amount { get; set; }
    public DateTime SpentOn { get; set; }
    public string? ReceiptUrl { get; set; }
}

