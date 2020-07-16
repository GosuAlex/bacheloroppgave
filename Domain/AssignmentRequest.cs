using System;

namespace Domain
{
  public class AssignmentRequest
  {
    public string Id { get; set; }
    public string TeamId { get; set; }
    public string TeamName { get; set; }
    public string AssignmentId { get; set; }
    public string AssignmentTitle { get; set; }
  }
}