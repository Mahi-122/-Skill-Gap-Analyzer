package Skill.Gap.Analyzer.Backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Skill Gap Analyzer Backend is Running!";
    }
}