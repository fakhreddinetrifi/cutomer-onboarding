package customeronboarding.com.Models;

import lombok.Data;

@Data
public class FileInfo {
  private String name;
  private String url;
  private String encodedString;

  public FileInfo(String name, String url, String encodedString) {
    this.name = name;
    this.url = url;
    this.encodedString = encodedString;
  }

  public FileInfo(String name) {
    this.name = name;
  }
}
