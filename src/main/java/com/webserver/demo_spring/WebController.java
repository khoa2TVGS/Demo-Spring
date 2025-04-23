package com.webserver.demo_spring;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    @GetMapping("/")
    public String index() {
        return "index";
    }
    @GetMapping("/login")
    public String hello() {
        return "login";
    }
    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }
}
