package customeronboarding.com.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import customeronboarding.com.Models.Email;
import customeronboarding.com.Models.EmailCfg;
import customeronboarding.com.Models.FileInfo;
import customeronboarding.com.service.FilesStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.MimeMessage;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.MimeMessageHelper;

@RestController
@CrossOrigin
public class EmailControllerWithAttachments {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    FilesStorageService storageService;
    private final Path root = Paths.get("uploads");
    private static String[] emails;

    private void sendEmailMultiAttachment(final String subject, final String message, final String fromEmailAddress,
                                         final String toEmailAddress, final File[] attachments, final boolean isHtmlMail) {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            // use the true flag to indicate you need a multipart message
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(fromEmailAddress);
            helper.setTo(toEmailAddress);
            helper.setSubject(subject);

            if (isHtmlMail) {
                helper.setText("<html><body>" + message + "</body></html>", true);
            } else {
                helper.setText(message);
            }

            // add the file attachment
            for (File file : attachments) {
                FileSystemResource fr = new FileSystemResource(file);
                helper.addAttachment(file.getName(), fr);
            }

            mailSender.send(mimeMessage);

            System.out.println("Email sending with multiple attachments complete.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

//    public void setMailSender(JavaMailSender mailSender) {
//        this.mailSender = mailSender;
//    }

    @PostMapping("/sendemail")
    public String sendMail(@RequestBody Email email) throws AddressException, MessagingException, IOException {

        List<FileInfo> fileInfos = storageService.loadAll().map(path -> {
            String filename = path.getFileName().toString();
            return new FileInfo(filename);
        }).collect(Collectors.toList());
        File[] attachments = new File[fileInfos.size()];
        for (int i = 0; i < fileInfos.size(); i++) {
            attachments[i] = new File(root + "/" + fileInfos.get(i).getName());
        }
        ObjectMapper mapper = new ObjectMapper();
        EmailCfg emailCfg = mapper.readValue(new File("src\\main\\resources\\config.json"), EmailCfg.class);
        sendEmailMultiAttachment(emailCfg.getSubject(),
                                 email.getContent(),
                                 email.getFrom(),
                                 emailCfg.getTo(),
                                 attachments,
                                true);
        return "Email sending with multiple attachments complete.";
    }
//
//    @PostMapping("/recieved")
//    public String recievedMail(@RequestBody Email email) throws AddressException, MessagingException, IOException {
//        File[] attachments = new File[] {};
//        ObjectMapper mapper = new ObjectMapper();
//        EmailCfg emailCfg = mapper.readValue(new File("src\\main\\resources\\config.json"), EmailCfg.class);
//        sendEmailMultiAttachment("test",
//                "test",
//                emailCfg.getTo(),
//                email.getFrom(),
//                attachments,
//                true);
//        return "sended";
//    }
}
