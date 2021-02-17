package customeronboarding.com.Models;

import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class EmailCfg {
    private boolean auth;
    private boolean starttls;
    private String host;
    private int port;
    private String username;
    private String password;
    private String to;
    private String subject;
}
