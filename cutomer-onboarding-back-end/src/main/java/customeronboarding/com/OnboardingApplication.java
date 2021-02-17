package customeronboarding.com;

import customeronboarding.com.service.FilesStorageService;
import javax.annotation.Resource;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class OnboardingApplication extends SpringBootServletInitializer {

    @Resource
    FilesStorageService storageService;

    public static void main(String[] args) {
        SpringApplication.run(OnboardingApplication.class, args);
    }


    public void run(String... arg) throws Exception {
        storageService.deleteAll();
        storageService.init();
    }
}
