package customeronboarding.com.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@Data
public class Email {
    private String from;
    private String content;
    private String[] attachments;
}
