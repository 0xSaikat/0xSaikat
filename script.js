class TerminalPortfolio {
    constructor() {
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        this.cursor = document.getElementById('cursor');
        this.timestamp = document.getElementById('timestamp');
        this.card3d = document.getElementById('card3d');
        
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentRotationY = 0;
        this.currentRotationX = 0;
        
        this.initializeTerminal();
        this.updateTimestamp();
        this.setupEventListeners();
        this.setup3DCard();
        this.setupCardStrap();
        this.initializeGrabAnimation();
    }

    initializeTerminal() {

        if (this.input) {
            this.input.focus();
        }
        
        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            projects: this.showProjects.bind(this),
            skills: this.showSkills.bind(this),
            experience: this.showExperience.bind(this),
            contact: this.showContact.bind(this),
            education: this.showEducation.bind(this),
            certifications: this.showCertifications.bind(this),
            leadership: this.showLeadership.bind(this),
            clear: this.clearTerminal.bind(this),
            sudo: this.showSudo.bind(this),
            welcome: this.showWelcome.bind(this),
            whoami: this.showWhoami.bind(this),
            ls: this.listCommands.bind(this),
            pwd: this.showPath.bind(this),
            date: this.showDate.bind(this),
            halloffame: this.showHallOfFame.bind(this),
            hof: this.showHallOfFame.bind(this),
            cv: this.downloadResume.bind(this),
            resume: this.downloadResume.bind(this),
            donate: this.showDonate.bind(this),
            support: this.showDonate.bind(this),
            crypto: this.showDonate.bind(this),
            wallet: this.showDonate.bind(this)
        };
    }

    initializeGrabAnimation() {
    
    setTimeout(() => {
        this.startGrabBounceAnimation();
    }, 800); 
}


startGrabBounceAnimation() {
    const cardStrap = document.getElementById('cardStrap');
    
    
    if (this.card3d) {
        this.card3d.classList.add('card-grab-bounce');
        
        
        setTimeout(() => {
            this.card3d.classList.remove('card-grab-bounce');
        }, 2500);
    }
    
    if (cardStrap) {
        cardStrap.classList.add('strap-tension');
        
        
        setTimeout(() => {
            cardStrap.classList.remove('strap-tension');
        }, 2500);
    }
    
    
    this.addGrabEffect();
}


addGrabEffect() {
    
    setTimeout(() => {
        if (this.output) {
            const grabMessage = document.createElement('div');
            grabMessage.className = 'output';
            grabMessage.style.color = '#888';
            grabMessage.style.fontSize = '0.9em';
            this.output.appendChild(grabMessage);
            this.smoothScrollToBottom();
        }
    }, 1500);
}

    copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            this.addOutput(`<span style="color: #00ff00;">✅ Copied to clipboard: ${text}</span>`);
        }).catch(() => {
            this.fallbackCopy(text);
        });
    } else {
        this.fallbackCopy(text);
    }
}


fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        this.addOutput(`<span style="color: #00ff00;">✅ Copied to clipboard: ${text}</span>`);
    } catch (err) {
        this.addOutput(`<span style="color: #ff4444;">❌ Failed to copy. Please copy manually: ${text}</span>`);
    }
    
    document.body.removeChild(textArea);
}

    setupCardStrap() {
    const cardStrap = document.getElementById('cardStrap');
    const profileCard = document.querySelector('.profile-card');
    
    if (cardStrap && profileCard) {
        let isDraggingStrap = false;
        let startY = 0;
        let currentY = 0;
        
        cardStrap.addEventListener('mousedown', (e) => {
            isDraggingStrap = true;
            startY = e.clientY;
            cardStrap.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDraggingStrap) {
                currentY = e.clientY - startY;
                currentY = Math.max(0, Math.min(currentY, 50));
                
                profileCard.style.transform = `translateY(${currentY}px)`;
                cardStrap.style.transform = `translateX(-50%) translateY(${currentY * 0.3}px)`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDraggingStrap) {
                isDraggingStrap = false;
                cardStrap.style.cursor = 'grab';
                
                profileCard.style.transform = 'translateY(0px)';
                cardStrap.style.transform = 'translateX(-50%) translateY(0px)';
                
                cardStrap.classList.add('swinging');
                profileCard.classList.add('bouncing');
                
                setTimeout(() => {
                    cardStrap.classList.remove('swinging');
                    profileCard.classList.remove('bouncing');
                }, 2000);
            }
        });
        
        cardStrap.addEventListener('touchstart', (e) => {
            isDraggingStrap = true;
            startY = e.touches[0].clientY;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDraggingStrap) {
                currentY = e.touches[0].clientY - startY;
                currentY = Math.max(0, Math.min(currentY, 50));
                
                profileCard.style.transform = `translateY(${currentY}px)`;
                cardStrap.style.transform = `translateX(-50%) translateY(${currentY * 0.3}px)`;
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', () => {
            if (isDraggingStrap) {
                isDraggingStrap = false;
                
                profileCard.style.transform = 'translateY(0px)';
                cardStrap.style.transform = 'translateX(-50%) translateY(0px)';
                
                cardStrap.classList.add('swinging');
                profileCard.classList.add('bouncing');
                
                setTimeout(() => {
                    cardStrap.classList.remove('swinging');
                    profileCard.classList.remove('bouncing');
                }, 2000);
            }
        });
    }
}

    startDragStrap(e) {
        this.isDragging = true;
        this.startY = e.clientY;
        if (this.card3d) {
            this.card3d.classList.add('dragging');
        }
    }

    startDragStrapTouch(e) {
        this.isDragging = true;
        this.startY = e.touches[0].clientY;
        if (this.card3d) {
            this.card3d.classList.add('dragging');
        }
    }

    setup3DCard() {
        if (!this.card3d) return;
        
        this.card3d.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        
        this.card3d.addEventListener('touchstart', this.startDragTouch.bind(this), { passive: false });
        document.addEventListener('touchmove', this.dragTouch.bind(this), { passive: false });
        document.addEventListener('touchend', this.stopDrag.bind(this));
        
        setInterval(() => {
            if (!this.isDragging) {
                this.currentRotationY += 0.5;
                this.updateCardRotation();
            }
        }, 100);
    }

    startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        if (this.card3d) {
            this.card3d.classList.add('dragging');
        }
        e.preventDefault();
    }

    startDragTouch(e) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        if (this.card3d) {
            this.card3d.classList.add('dragging');
        }
        e.preventDefault();
    }

    drag(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        
        this.currentRotationY += deltaX * 0.5;
        this.currentRotationX -= deltaY * 0.5;
        
        this.currentRotationX = Math.max(-45, Math.min(45, this.currentRotationX));
        
        this.updateCardRotation();
        
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    dragTouch(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - this.startX;
        const deltaY = e.touches[0].clientY - this.startY;
        
        this.currentRotationY += deltaX * 0.5;
        this.currentRotationX -= deltaY * 0.5;
        
        this.currentRotationX = Math.max(-45, Math.min(45, this.currentRotationX));
        
        this.updateCardRotation();
        
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }

    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            if (this.card3d) {
                this.card3d.classList.remove('dragging');
                this.card3d.classList.add('card-bounce');
                
                setTimeout(() => {
                    if (this.card3d) {
                        this.card3d.classList.remove('card-bounce');
                    }
                }, 600);
            }
            
            const returnToCenter = () => {
                this.currentRotationX *= 0.95;
                if (Math.abs(this.currentRotationX) > 0.1) {
                    this.updateCardRotation();
                    requestAnimationFrame(returnToCenter);
                }
            };
            returnToCenter();
        }
    }

    updateCardRotation() {
        if (this.card3d) {
            this.card3d.style.setProperty('--rotateY', this.currentRotationY + 'deg');
            this.card3d.style.setProperty('--rotateX', this.currentRotationX + 'deg');
        }
    }

    setupInputCursor() {
    if (this.input) {
        const inputLine = this.input.closest('.input-line');
        
        this.input.addEventListener('input', () => {
            if (this.input.value.length > 0) {
                inputLine.classList.add('typing');
            } else {
                inputLine.classList.remove('typing');
            }
        });
        
        this.input.addEventListener('blur', () => {
            if (this.input.value.length === 0) {
                inputLine.classList.remove('typing');
            }
        });
    }
}

    setupEventListeners() {

        if (this.input) {
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.processCommand();
                } else if (e.key === 'ArrowUp') {
                    this.navigateHistory(-1);
                    e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                    this.navigateHistory(1);
                    e.preventDefault();
                } else if (e.key === 'Tab') {
                    this.autoComplete();
                    e.preventDefault();
                }
            });
        }

        document.addEventListener('click', (e) => {
            if (this.input && !e.target.closest('.card-3d')) {
                this.input.focus();
            }
        });

        if (this.input) {
            this.input.focus();
        }

        setInterval(() => this.updateTimestamp(), 1000);
    }

    processCommand() {
    if (!this.input || !this.output) return;
    
    const command = this.input.value.trim().toLowerCase();
    if (command === '') return;

    this.addToHistory(command);
    this.addCommandToOutput(command);
    
    if (this.commands[command]) {
        this.commands[command]();
    } else {
        this.showError(command);
    }
    
    this.input.value = '';
    this.scrollToBottom();
    this.input.focus();
}

    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
    }

    navigateHistory(direction) {
        if (this.commandHistory.length === 0 || !this.input) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }
        
        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    autoComplete() {
        if (!this.input) return;
        
        const input = this.input.value.toLowerCase();
        const commands = Object.keys(this.commands);
        const matches = commands.filter(cmd => cmd.startsWith(input));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        }
    }

    addCommandToOutput(command) {
        if (!this.output) return;
        
        const commandLine = document.createElement('div');
        commandLine.className = 'command-line fade-in';
        commandLine.innerHTML = `
            <span class="prompt">0xSaikat@hackbit:~$</span>
            <span class="command">${this.escapeHtml(command)}</span>
        `;
        this.output.appendChild(commandLine);
    }

    addOutput(content) {
    if (!this.output) return;
    
    const output = document.createElement('div');
    output.className = 'output fade-in';
    output.innerHTML = content;
    this.output.appendChild(output);
    
    this.smoothScrollToBottom();
}

smoothScrollToBottom() {
    const terminalContent = document.querySelector('.terminal-content');
    if (!terminalContent) return;
    
    const targetScroll = terminalContent.scrollHeight - terminalContent.clientHeight;
    const currentScroll = terminalContent.scrollTop;
    const scrollDifference = targetScroll - currentScroll;
    
    if (scrollDifference <= 0) return;
    
    const scrollDuration = Math.min(800, Math.max(300, scrollDifference * 2));
    const startTime = performance.now();
    
    const animateScroll = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / scrollDuration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        terminalContent.scrollTop = currentScroll + (scrollDifference * easeOut);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };
    
    requestAnimationFrame(animateScroll);
}

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
    this.smoothScrollToBottom();
}

    showError(command) {
        this.addOutput(`
            <span style="color: #ff4444;">Command not found: ${this.escapeHtml(command)}</span><br>
            Type 'help' to see available commands.
        `);
    }

    showHelp() {
    this.addOutput(`
        Available commands:<br>
        <span class="help-command">about</span>        - Learn about me<br>
        <span class="help-command">projects</span>     - View my projects<br>
        <span class="help-command">skills</span>       - See my technical skills<br>
        <span class="help-command">experience</span>   - My work experience<br>
        <span class="help-command">contact</span>      - How to reach me<br>
        <span class="help-command">education</span>    - My educational background<br>
        <span class="help-command">certifications</span> - View my certifications<br>
        <span class="help-command">leadership</span>   - Leadership and community involvement<br>
        <span class="help-command">cv</span>           - Download my resume/CV<br>
        <span class="help-command">resume</span>       - Download my resume/CV<br>
        <span class="help-command">donate</span>       - Support my cybersecurity research 💰<br>
        <span class="help-command">support</span>      - Support my cybersecurity research 💰<br>
        <span class="help-command">clear</span>        - Clear the terminal<br>
        <span class="help-command">halloffame</span>  - View my security hall of fame recognitions<br>
        <span class="help-command">hof</span>         - View my security hall of fame recognitions<br>
        <span class="help-command">sudo</span>         - Try it and see 😉<br><br>
        Bonus commands: <span class="help-command">whoami</span>, <span class="help-command">ls</span>, <span class="help-command">pwd</span>, <span class="help-command">date</span>, <span class="help-command">crypto</span>, <span class="help-command">wallet</span>
    `);
}

    showAbout() {
    this.addOutput(`
        <span style="color: #00ffff;">About Sakil Hasan Saikat</span><br><br>
        Hi! I'm Saikat, a passionate Cybersecurity Researcher and Ethical Hacker with expertise in vulnerability assessment, penetration testing, and responsible security disclosure. <br><br>
        
        🏆 CVE-2024-49054 Owner - Microsoft recognized vulnerability<br>
        🛡️ 25+ Hall of Fame recognitions from tech giants<br>
        🎯 Independent Security Researcher and Bug Bounty Hunter<br>
        🇧🇩 Based in Khulna, Bangladesh, securing systems globally<br>
        📚 CSE Student at NUBTK and continuous security learner<br>
        🤝 Intel Student Ambassador and Infosec BD Campus Ambassador<br><br>
        
        I'm dedicated to enhancing global cybersecurity through cutting-edge research,<br>
        responsible disclosure, and sharing knowledge with the security community.<br>
        My mission is to make the digital world safer, one vulnerability at a time.
    `);
}

    showProjects() {
    this.addOutput(`
        <span style="color: #00ffff;">My Projects</span><br><br>
        
        🔍 <span style="color: #0ad558;">FindME - Advanced OSINT Reconnaissance Platform</span><br>
        &nbsp;&nbsp;&nbsp;• Built with Python, CLI, and API Integration<br>
        &nbsp;&nbsp;&nbsp;• Discovers social media profiles across 400+ platforms<br>
        &nbsp;&nbsp;&nbsp;• Advanced data correlation for digital footprint analysis<br><br>
        
        ⚙️ <span style="color: #0ad558;">Penstaller - Automated Security Toolkit Deployment</span><br>
        &nbsp;&nbsp;&nbsp;• Python-based automation and package management<br>
        &nbsp;&nbsp;&nbsp;• Streamlined installation of penetration testing tools<br>
        &nbsp;&nbsp;&nbsp;• Cross-platform compatibility and workflow optimization<br><br>
        
        🛡️ <span style="color: #0ad558;">ShieldPlus - Enterprise Password Security Analyzer</span><br>
        &nbsp;&nbsp;&nbsp;• Python with security APIs and pattern recognition<br>
        &nbsp;&nbsp;&nbsp;• Comprehensive password strength evaluation system<br>
        &nbsp;&nbsp;&nbsp;• Integrated compromised credential detection<br><br>
        
        💰 <span style="color: #0ad558;">NUBTK CSE Payment Management Portal</span><br>
        &nbsp;&nbsp;&nbsp;• Built with Node.js, JavaScript, and web security<br>
        &nbsp;&nbsp;&nbsp;• Full-stack payment tracking for university students<br>
        &nbsp;&nbsp;&nbsp;• Real-time processing and enhanced security features<br><br>
        
        🏆 <span style="color: #0ad558;">CVE-2024-49054 - Microsoft Security Vulnerability</span><br>
        &nbsp;&nbsp;&nbsp;• Critical vulnerability discovered and responsibly disclosed<br>
        &nbsp;&nbsp;&nbsp;• Recognized by Microsoft Security Response Center<br><br>
        
        Visit my <a href="https://github.com/0xsaikat" target="_blank" style="color: #00ff00;">GitHub</a> for more security projects and research tools!
    `);
}

    showSkills() {
    this.addOutput(`
        <span style="color: #00ffff;">Technical Skills</span><br><br>
        
        <span style="color: #0ad558;">Programming Languages:</span><br>
        • Python 🐍 • JavaScript • Node.js • Bash/Shell Scripting<br><br>
        
        <span style="color: #0ad558;">Security Testing & Penetration Testing:</span><br>
        • Web Application Security • Network Security Assessment<br>
        • Vulnerability Research • VAPT (Vulnerability Assessment & Penetration Testing)<br><br>
        
        <span style="color: #0ad558;">Security Tools:</span><br>
        • Reconnaissance: Nuclei, Subfinder, Katana, Amass<br>
        • Web Testing: Burp Suite, OWASP ZAP, SQLmap<br>
        • Network: Nmap, Metasploit, Wireshark<br><br>
        
        <span style="color: #0ad558;">Specialized Areas:</span><br>
        • OSINT & Digital Reconnaissance • Bug Bounty Research<br>
        • Threat Intelligence • Security Automation<br><br>
        
        <span style="color: #0ad558;">Platforms & Technologies:</span><br>
        • Linux • Docker • AWS • Git<br>
        • Database Management • Web Security<br><br>
        
        <span style="color: #0ad558;">Security Research Tools:</span><br>
        • Custom Python Security Scripts • API Integration<br>
        • Pattern Recognition • Data Correlation Techniques
    `);
}

    showExperience() {
    this.addOutput(`
        <span style="color: #00ffff;">Work Experience</span><br><br>
        
        <span style="color: #0ad558;">Student Ambassador</span> @ Intel Corporation<br>
        <span style="color: #888;">April 2025 - Present</span><br>
        • Represent Intel's technology initiatives in university communities<br>
        • Organize technical workshops on emerging technologies and cybersecurity<br>
        • Bridge academic research with industry applications in semiconductor tech<br>
        • Mentor students in technology careers and Intel's educational programs<br>
        • Facilitate partnerships between Intel and academic institutions<br><br>
        
        <span style="color: #0ad558;">Independent Security Researcher</span> @ Multiple Organizations<br>
        <span style="color: #888;">June 2024 - Present</span><br>
        • Discovered and reported critical security vulnerabilities (CVE-2024-49054)<br>
        • Achieved Hall of Fame recognition across 25+ organizations<br>
        • Microsoft, Apple, Google, Oracle, NVIDIA, NASA, U.S. Treasury<br>
        • Conducted comprehensive security assessments on web apps and infrastructure<br>
        • Maintained 100% responsible disclosure compliance<br><br>
        
        <span style="color: #0ad558;">Campus Ambassador - Cybersecurity Outreach</span> @ Infosec BD<br>
        <span style="color: #888;">September 2024 - Present</span><br>
        • Lead cybersecurity awareness initiatives within university ecosystem<br>
        • Design and deliver hands-on workshops on ethical hacking methodologies<br>
        • Facilitate knowledge transfer between academic and practical cybersecurity<br>
        • Mentor emerging cybersecurity professionals in ethical hacking community
    `);
}

    showContact() {
    this.addOutput(`
        <span style="color: #00ffff;">Contact Information</span><br><br>
        
        📧 <span style="color: #0ad558;">Email:</span> <a href="mailto:saikat@hackbit.org" target="_blank" style="color: #00ff00;">saikat@hackbit.org</a><br>
        🔗 <span style="color: #0ad558;">LinkedIn:</span> <a href="https://linkedin.com/in/0xsaikat" target="_blank" style="color: #00ff00;">linkedin.com/in/0xsaikat</a><br>
        🐙 <span style="color: #0ad558;">GitHub:</span> <a href="https://github.com/0xsaikat" target="_blank" style="color: #00ff00;">github.com/0xsaikat</a><br>
        🌐 <span style="color: #0ad558;">Website:</span> <a href="https://saikat.hackbit.org" target="_blank" style="color: #00ff00;">saikat.hackbit.org</a><br>
        📱 <span style="color: #0ad558;">Phone:</span> Available on Request<br>
        📍 <span style="color: #0ad558;">Location:</span> Khulna, Bangladesh<br><br>
        
        Feel free to reach out for cybersecurity collaboration opportunities,<br>
        vulnerability research discussions, or ethical hacking insights!
    `);
}

    showEducation() {
    this.addOutput(`
        <span style="color: #00ffff;">Education</span><br><br>
        
        <span style="color: #0ad558;">Bachelor of Science in Computer Science & Engineering</span><br>
        Northern University of Business & Technology Khulna (NUBTK) • 2023-2027 (Expected)<br>
        • Specialization in Cybersecurity & Software Engineering<br>
        • Focus on Vulnerability Research & Ethical Hacking<br>
        • Active in cybersecurity research projects<br><br>
        
        <span style="color: #0ad558;">Higher Secondary Certificate in Science</span><br>
        Cantonment College Jashore • 2019-2022<br>
        • GPA: 4.92/5.00<br>
        • Excellence in Mathematics & Computer Science<br>
        • Foundation in analytical thinking and problem-solving<br><br>
        
        <span style="color: #0ad558;">Professional Development & Training:</span><br>
        • Certified Network Security Practitioner (CNSP)<br>
        • Certified Application Security Practitioner (CAP)<br>
        • Google Cybersecurity Certificate<br>
        • TryHackMe Advanced Cybersecurity Training
    `);
}

    showCertifications() {
    this.addOutput(`
        <span style="color: #00ffff;">Certifications</span><br><br>
        
        🔐 <span style="color: #0ad558;">Certified Network Security Practitioner (CNSP)</span> - 2024<br>
        &nbsp;&nbsp;&nbsp;Advanced network security and penetration testing<br><br>
        
        🛡️ <span style="color: #0ad558;">Certified Application Security Practitioner (CAP)</span> - 2024<br>
        &nbsp;&nbsp;&nbsp;Web application security and vulnerability assessment<br><br>
        
        🔥 <span style="color: #0ad558;">Cybersecurity Fundamentals</span> - Palo Alto Networks<br>
        &nbsp;&nbsp;&nbsp;Enterprise security architecture and threat prevention<br><br>
        
        🏆 <span style="color: #0ad558;">TryHackMe Advent of Cyber 2024</span><br>
        &nbsp;&nbsp;&nbsp;Advanced ethical hacking and cybersecurity challenges<br><br>
        
        🔍 <span style="color: #0ad558;">Google Cybersecurity Certificate</span><br>
        &nbsp;&nbsp;&nbsp;Comprehensive cybersecurity fundamentals and practices<br><br>
        
        🎯 <span style="color: #0ad558;">CVE-2024-49054 Owner</span> - Microsoft<br>
        &nbsp;&nbsp;&nbsp;Critical vulnerability discovery and responsible disclosure
    `);
}

    showLeadership() {
    this.addOutput(`
        <span style="color: #00ffff;">Leadership & Community</span><br><br>
        
        🎯 <span style="color: #0ad558;">Student Ambassador</span> - Intel Corporation<br>
        &nbsp;&nbsp;&nbsp;• Representing Intel's technology initiatives in university communities<br>
        &nbsp;&nbsp;&nbsp;• Organizing technical workshops on emerging technologies<br>
        &nbsp;&nbsp;&nbsp;• Mentoring students in technology careers and Intel programs<br>
        &nbsp;&nbsp;&nbsp;• Facilitating partnerships between Intel and academic institutions<br><br>
        
        🛡️ <span style="color: #0ad558;">Campus Ambassador</span> - Infosec BD<br>
        &nbsp;&nbsp;&nbsp;• Leading cybersecurity awareness initiatives in university ecosystem<br>
        &nbsp;&nbsp;&nbsp;• Designing hands-on workshops on ethical hacking methodologies<br>
        &nbsp;&nbsp;&nbsp;• Mentoring emerging cybersecurity professionals<br>
        &nbsp;&nbsp;&nbsp;• Fostering ethical hacking community development<br><br>
        
        🏆 <span style="color: #0ad558;">CVE Owner & Security Researcher</span><br>
        &nbsp;&nbsp;&nbsp;• CVE-2024-49054 assigned by Microsoft<br>
        &nbsp;&nbsp;&nbsp;• 25+ Hall of Fame recognitions from tech giants<br>
        &nbsp;&nbsp;&nbsp;• Microsoft, Apple, Oracle, NVIDIA, NASA, U.S. Treasury<br>
        &nbsp;&nbsp;&nbsp;• Stanford, Drexel, Utrecht, Sheffield Universities<br><br>
        
        💻 <span style="color: #0ad558;">Open Source Contributor</span><br>
        &nbsp;&nbsp;&nbsp;• FindME - OSINT Reconnaissance Platform (400+ platforms)<br>
        &nbsp;&nbsp;&nbsp;• Penstaller - Automated Security Toolkit Deployment<br>
        &nbsp;&nbsp;&nbsp;• ShieldPlus - Enterprise Password Security Analyzer<br>
        &nbsp;&nbsp;&nbsp;• Contributing to global cybersecurity enhancement
    `);
}


    showDonate() {
    this.addOutput(`
        <span style="color: #00ffff;">💰 Support My Cybersecurity Research</span><br><br>
        
        <span style="color: #0ad558;">🚀 Help fund my security research and open-source projects!</span><br><br>
        
        <div class="crypto-wallet">
            <span style="color: #ff6b6b;">🌐 Unstoppable Domain:</span><br>
            <span class="wallet-address" onclick="copyToClipboard('0xsaikat.crypto')" title="Click to copy">
                0xsaikat.crypto
            </span>
            <span class="copy-hint">[Click to copy]</span><br><br>
            
            <span style="color: #ff6b6b;">💎 Wallet Address (ETH/Polygon/BSC):</span><br>
            <span class="wallet-address" onclick="copyToClipboard('0x82bcf49437dc29ec5ebc3dcc4f5e8a7f8d2068db')" title="Click to copy">
                0x82bcf49437dc29ec5ebc3dcc4f5e8a7f8d2068db
            </span>
            <span class="copy-hint">[Click to copy]</span><br><br>
        </div>
        
        <span style="color: #0ad558;">🎯 Your support helps me:</span><br>
        • Continue vulnerability research and responsible disclosure<br>
        • Develop open-source security tools (FindME, Penstaller, ShieldPlus)<br>
        • Create educational cybersecurity content<br>
        • Contribute to the global security community<br><br>
        
        <span style="color: #888;">💝 Every contribution, no matter the size, makes a difference!</span><br>
        <span style="color: #00ff00;">Thank you for supporting ethical hacking and cybersecurity research! 🙏</span>
    `);
}

    showHallOfFame() {
    this.addOutput(`
        <span style="color: #00ffff;">🏆 Security Research Hall of Fame - 30+ Organizations</span><br><br>
        
        <span style="color: #0ad558;">🏅 Special Achievement:</span><br>
        • <span style="color: #ff6b6b;">CVE-2024-49054</span> - <a href="https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-49054" target="_blank" style="color: #00ff00;">Microsoft Critical Vulnerability</a><br>
        • <span style="color: #ff6b6b;">Google Dragon Badge 2024</span> - <a href="https://bughunters.google.com/profile/65b1339f-ee0b-4c08-8c66-f6e0e8390c24" target="_blank" style="color: #00ff00;">Year of the Dragon Recognition</a><br><br>
        
        <span style="color: #0ad558;">💻 Technology Giants:</span><br>
        • <a href="https://msrc.microsoft.com/update-guide" target="_blank" style="color: #00ff00;">Microsoft Security Response Center</a> (2024, 2024)<br>
        • <a href="https://support.apple.com/en-us/102774" target="_blank" style="color: #00ff00;">Apple Security</a> (Nov 2024, Feb 2025)<br>
        • <a href="https://bughunters.google.com/profile/65b1339f-ee0b-4c08-8c66-f6e0e8390c24" target="_blank" style="color: #00ff00;">Google Bug Hunters</a> (Jun 2024)<br>
        • <a href="https://www.oracle.com/security-alerts/cpujul2025.html" target="_blank" style="color: #00ff00;">Oracle Corporation</a> (Jul 2025)<br>
        • <a href="https://www.nvidia.com/en-us/security/acknowledgements/" target="_blank" style="color: #00ff00;">NVIDIA Corporation</a> (Oct 2024)<br>
        • <a href="https://support.sap.com/en/my-support/knowledge-base/security-notes-news/credits-for-security-researchers.html" target="_blank" style="color: #00ff00;">SAP SE</a> (Sep 2024)<br><br>
        
        <span style="color: #0ad558;">🏛️ Government & International Organizations:</span><br>
        • <a href="https://bugcrowd.com/nasa_vdp" target="_blank" style="color: #00ff00;">NASA - National Aeronautics and Space Administration</a> (Aug 2024)<br>
        • <a href="https://bugcrowd.com/treasury_vdp" target="_blank" style="color: #00ff00;">U.S. Department of Treasury</a> (Aug 2024)<br>
        • <a href="https://bugcrowd.com/nationalscience" target="_blank" style="color: #00ff00;">National Science Foundation</a> (Aug 2024)<br>
        • <a href="https://bugcrowd.com/usgs_vdp" target="_blank" style="color: #00ff00;">U.S. Geological Survey</a> (Aug 2024)<br>
        • <a href="https://www.linkedin.com/in/0xsaikat/details/honors/" target="_blank" style="color: #00ff00;">U.S. Department of Education</a> (Aug 2024)<br>
        • <a href="https://www.who.int/about/cybersecurity/vulnerability-hall-of-fame/ethical-hacker-list" target="_blank" style="color: #00ff00;">World Health Organization (WHO)</a> (Sep 2024)<br>
        • <a href="https://www.unesco.org/en/vulnerability-disclosure" target="_blank" style="color: #00ff00;">UNESCO</a> (Sep 2024)<br>
        • <a href="https://cert.europa.eu/hall-of-fame" target="_blank" style="color: #00ff00;">European Union CERT</a> (Sep 2024)<br><br>
        
        <span style="color: #0ad558;">🎓 Universities & Academic Institutions:</span><br>
        • <a href="https://hackerone.com/stanford-university" target="_blank" style="color: #00ff00;">Stanford University</a> (Jun 2025)<br>
        • <a href="https://drexel.edu/it/security/services-processes/bug-bounty/" target="_blank" style="color: #00ff00;">Drexel University</a> (Aug 2024)<br>
        • <a href="https://www.uu.nl/en/organisation/information-and-technology-services-its/hall-of-fame-responsible-disclosure" target="_blank" style="color: #00ff00;">Utrecht University</a> (Oct 2024)<br>
        • <a href="https://www.sheffield.ac.uk/it-services/security-vulnerability-disclosure" target="_blank" style="color: #00ff00;">University of Sheffield</a> (Sep 2024)<br>
        • <a href="https://security.utexas.edu/hall-of-fame" target="_blank" style="color: #00ff00;">University of Texas at Austin</a> (Aug 2024)<br>
        • <a href="https://security.utu.fi/acknowledgements.html" target="_blank" style="color: #00ff00;">University of Turku</a> (Aug 2024)<br>
        • <a href="https://www.linkedin.com/in/0xsaikat/details/honors/" target="_blank" style="color: #00ff00;">University of Oslo</a> (Nov 2024)<br><br>
        
        <span style="color: #0ad558;">🏢 Corporate & Enterprise:</span><br>
        • <a href="https://www.siemens.com/global/en/products/services/cert/hall-of-thanks.html" target="_blank" style="color: #00ff00;">Siemens AG</a> (Sep 2024)<br>
        • <a href="https://www.adyen.com/policies-and-disclaimer/responsible-disclosure-hall-of-fame" target="_blank" style="color: #00ff00;">Adyen N.V.</a> (Aug 2024)<br>
        • <a href="https://bugcrowd.com/unilever" target="_blank" style="color: #00ff00;">Unilever PLC</a> (Jun 2024)<br>
        • <a href="https://bugcrowd.com/northwestern-mutual" target="_blank" style="color: #00ff00;">Northwestern Mutual</a> (Nov 2024)<br>
        • <a href="https://www.gea.com/en/company/about-us/information-security/products/responsible-disclosure-of-security-issues/hall-of-fame/" target="_blank" style="color: #00ff00;">GEA Group AG</a> (Aug 2024)<br>
        • <a href="https://www.linkedin.com/in/0xsaikat/details/honors/" target="_blank" style="color: #00ff00;">Zyxel Communications</a> (Aug 2024)<br><br>
        
        <span style="color: #0ad558;">🌍 Infrastructure & Specialized Organizations:</span><br>
        • <a href="https://www.linkedin.com/in/0xsaikat/details/honors/" target="_blank" style="color: #00ff00;">RIPE NCC</a> (Sep 2024 - First Bounty!)<br>
        • <a href="https://www.prg.aero/hall-of-fame" target="_blank" style="color: #00ff00;">Prague Airport</a> (Jan 2025)<br>
        • <a href="https://www.norkart.no/om-oss/trust-center" target="_blank" style="color: #00ff00;">Norkart AS</a> (Sep 2024)<br><br>
        
        <span style="color: #ff6b6b;">📊 Statistics:</span><br>
        • <span style="color: #00ffff;">Total Recognitions:</span> 30+ Organizations<br>
        • <span style="color: #00ffff;">CVE Assignments:</span> 1 (Microsoft)<br>
        • <span style="color: #00ffff;">Countries Reached:</span> 15+ Nations<br>
        • <span style="color: #00ffff;">First Bounty:</span> RIPE NCC (Sep 2024)<br>
        • <span style="color: #00ffff;">Latest Recognition:</span> Oracle (Jul 2025)<br><br>
        
        <span style="color: #888;">💡 All vulnerabilities discovered through ethical hacking and responsible disclosure practices</span><br>
        <span style="color: #888;">🔗 Complete recognition details available on <a href="https://www.linkedin.com/in/0xsaikat/details/honors/" target="_blank" style="color: #0ad558;">LinkedIn Profile</a></span>
    `);
}


    downloadResume() {
    this.addOutput(`
        <span style="color: #00ffff;">📄 Preparing resume download...</span><br><br>
        <div class="download-animation">
            <span style="color: #0ad558;">Downloading CV...</span>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            
        </div>
    `);
    
    
    setTimeout(() => {
        this.addOutput(`
            <span style="color: #00ff00;">✅ Download complete!</span><br>
            <span style="color: #888;">Thanks for downloading my CV. Hope we meet soon!</span>
        `);
        
        
        this.triggerCVDownload();
    }, 3000);
}


triggerCVDownload() {
    const downloadFile = (url, fileName) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    
    
    const resumeUrl = 'https://saikat.hackbit.org/cv.pdf';
    downloadFile(resumeUrl, 'Saikat_Resume.pdf');
}

    clearTerminal() {
    if (this.output) {

        this.output.innerHTML = '';

        if (this.input) {
            this.input.focus();
        }
    }
}

    showSudo() {
        this.addOutput(`
            <span style="color: #ff4444;">[sudo] password for 0xSaikat:</span> <br>
            <span style="color: #ff4444;">0xSaikat is not in the sudoers file. This incident will be reported.</span><br><br>
            
            <span style="color: #00ffff;">Just kidding! 😄</span><br>
            You don't need sudo powers to explore my portfolio.<br>
            Try the other commands instead!
        `);
    }

    showWelcome() {
        this.addOutput(`
            Hi, I'm Sakil Hasan Saikat, Cybersecurity Researcher &
Ethical Hacker.<br><br>
            Welcome to my interactive 'AI powered' portfolio terminal!<br>
            Type 'help' to see available commands.
        `);
    }

    showWhoami() {
        this.addOutput(`
            <b>0xSaikat</b><br> <br>
            Sakil Hasan Saikat - Cybersecurity Researcher &
Ethical Hacker.<br>
            Currently logged in to portfolio terminal!
        `);
    }

    listCommands() {
        this.addOutput(`
            about            certifications  education        leadership<br>
            clear            contact          experience       projects<br>
            date             help             ls               skills<br>
            sudo             welcome          whoami           pwd
        `);
    }

    showPath() {
        this.addOutput(`
            /home/hackbit/0xSaikat/portfolio
        `);
    }

    showDate() {
        const now = new Date();
        this.addOutput(`
            ${now.toString()}
        `);
    }

    updateTimestamp() {
        if (this.timestamp) {
            const now = new Date();
            this.timestamp.textContent = now.toLocaleString();
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        const terminal = new TerminalPortfolio();
        

        const input = document.getElementById('terminal-input');
        if (input) {
            input.focus();
            input.click();
        }
    }, 100);
});
