package customeronboarding.com.controller;

import customeronboarding.com.Models.FileInfo;
import customeronboarding.com.message.ResponseMessage;
import customeronboarding.com.service.FilesStorageService;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@CrossOrigin
public class FilesController {

  @Autowired
  FilesStorageService storageService;
  private final Path root = Paths.get("uploads");

  @PostMapping("/upload")
  public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file) {
    String message = "";
    try {
      storageService.save(file);

      message = "Uploaded the file successfully: " + file.getOriginalFilename();
      return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
    } catch (Exception e) {
      message = "Could not upload the file: " + file.getOriginalFilename() + "!";
      return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
    }
  }

  @GetMapping("/init")
  public ResponseEntity init() {
    storageService.deleteAll();
    storageService.init();
    return ResponseEntity.status(HttpStatus.OK).body("succes");
  }

  @GetMapping("/files")
  public ResponseEntity<List<FileInfo>> getListFiles() {
    List<FileInfo> fileInfos = storageService.loadAll().map(path -> {
      String filename = path.getFileName().toString();

      String url = MvcUriComponentsBuilder
              .fromMethodName(FilesController.class, "getFile", path.getFileName().toString()).build().toString();
      byte[] fileContent = new byte[0];
      try {
        fileContent = FileUtils.readFileToByteArray(new File(root + "/" + filename));
      } catch (IOException e) {
        e.printStackTrace();
      }
      String encodedString = Base64.getEncoder().encodeToString(fileContent);
      return new FileInfo(filename, url, encodedString);
    }).collect(Collectors.toList());

    return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
  }

  @GetMapping("/files/{filename:.+}")
  public ResponseEntity<Resource> getFile(@PathVariable String filename) {
    Resource file = storageService.load(filename);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"").body(file);
  }
}
