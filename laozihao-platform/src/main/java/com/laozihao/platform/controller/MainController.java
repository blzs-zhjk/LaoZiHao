package com.laozihao.platform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    @GetMapping("/about")
    public String about() {
        return "about";
    }
    
    @GetMapping("/solutions")
    public String solutions() {
        return "solutions";
    }
    
    @GetMapping("/case-studies")
    public String caseStudies() {
        return "case-studies";
    }
    
    @GetMapping("/case-study-detail/{id}")
    public String caseStudyDetail() {
        return "case-study-detail";
    }
    
    @GetMapping("/insights")
    public String insights() {
        return "insights";
    }
    
    @GetMapping("/insight-detail/{id}")
    public String insightDetail() {
        return "insight-detail";
    }
    
    @GetMapping("/contact")
    public String contact() {
        return "contact";
    }
} 