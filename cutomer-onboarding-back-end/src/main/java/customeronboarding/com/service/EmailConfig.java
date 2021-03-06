package customeronboarding.com.service;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import com.fasterxml.jackson.databind.ObjectMapper;
import customeronboarding.com.Models.EmailCfg;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSenderImpl mailSender() throws AddressException, MessagingException, IOException {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        ObjectMapper mapper = new ObjectMapper();
        EmailCfg emailCfg = mapper.readValue(new File("src\\main\\resources\\config.json"), EmailCfg.class);
        mailSender.setHost(emailCfg.getHost());
        mailSender.setPort(emailCfg.getPort());
        mailSender.setUsername(emailCfg.getUsername());
        mailSender.setPassword(emailCfg.getPassword());

        Properties javaMailProperties = new Properties();
        javaMailProperties.put("mail.smtp.auth", emailCfg.isAuth());
        javaMailProperties.put("mail.smtp.starttls.enable", emailCfg.isStarttls());

        mailSender.setJavaMailProperties(javaMailProperties);

        return mailSender;
    }

}
