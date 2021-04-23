package customeronboarding.com.Models;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class Email {
    private String from;
    private String content;
    private String to;
}
