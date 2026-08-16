(function () {
    "use strict";

    var USERS_KEY = "empreenda_users";
    var SESSION_KEY = "empreenda_session";

    function getUsers() {
        try {
            var raw = localStorage.getItem(USERS_KEY);
            if (!raw) {
                return [];
            }
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Falha ao ler usuarias do localStorage:", error);
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function setSession(payload, remember) {
        var data = {
            email: payload.email,
            name: payload.name,
            loggedAt: new Date().toISOString(),
            remember: Boolean(remember)
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    }

    function getSession() {
        try {
            var raw = localStorage.getItem(SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
    }

    function showMessage(element, type, text) {
        if (!element) {
            return;
        }
        element.className = "form-message";
        if (type) {
            element.classList.add(type);
        }
        element.textContent = text || "";
    }

    function clearMessage(element) {
        if (!element) {
            return;
        }
        element.className = "form-message";
        element.textContent = "";
    }

    function togglePassword(button) {
        var wrapper = button.closest(".input-field-wrapper");
        if (!wrapper) {
            return;
        }

        var input = wrapper.querySelector("input[type='password'], input[type='text']");
        if (!input) {
            return;
        }

        input.type = input.type === "password" ? "text" : "password";
    }

    function setupTogglePassword() {
        var buttons = document.querySelectorAll(".toggle-password");
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                togglePassword(button);
            });
        });
    }

    function setupRegisterForm() {
        var form = document.getElementById("register-form");
        if (!form) {
            return;
        }

        var messageEl = document.getElementById("register-message");

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            clearMessage(messageEl);

            var name = form.elements.name.value.trim();
            var email = normalizeEmail(form.elements.email.value);
            var phone = form.elements.phone.value.trim();
            var city = form.elements.city.value.trim();
            var business = form.elements.business.value;
            var stage = form.elements.stage.value;
            var password = String(form.elements.password.value || "");
            var confirmPassword = String(form.elements.confirmPassword.value || "");
            var terms = Boolean(form.elements.terms.checked);

            if (!name || !email || !phone || !city || !business || !stage || !password || !confirmPassword) {
                showMessage(messageEl, "is-error", "Preencha todos os campos obrigatorios para continuar.");
                return;
            }

            if (password.length < 6) {
                showMessage(messageEl, "is-error", "Sua senha precisa ter no minimo 6 caracteres.");
                return;
            }

            if (password !== confirmPassword) {
                showMessage(messageEl, "is-error", "A confirmacao de senha nao confere.");
                return;
            }

            if (!terms) {
                showMessage(messageEl, "is-error", "Voce precisa aceitar os termos para concluir o cadastro.");
                return;
            }

            var users = getUsers();
            var alreadyExists = users.some(function (item) {
                return normalizeEmail(item.email) === email;
            });

            if (alreadyExists) {
                showMessage(messageEl, "is-error", "Este e-mail ja esta cadastrado. Tente entrar na sua conta.");
                return;
            }

            var newUser = {
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                city: city,
                business: business,
                stage: stage,
                password: password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveUsers(users);
            setSession(newUser, true);

            showMessage(messageEl, "is-success", "Cadastro concluido com sucesso! Redirecionando para seu painel...");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1000);
        });
    }

    function setupLoginForm() {
        var form = document.getElementById("login-form");
        if (!form) {
            return;
        }

        var messageEl = document.getElementById("login-message");

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            clearMessage(messageEl);

            var email = normalizeEmail(form.elements.email.value);
            var password = String(form.elements.password.value || "");
            var remember = Boolean(form.elements.remember.checked);

            if (!email || !password) {
                showMessage(messageEl, "is-error", "Informe e-mail e senha para acessar.");
                return;
            }

            var users = getUsers();
            var user = users.find(function (item) {
                return normalizeEmail(item.email) === email && String(item.password) === password;
            });

            if (!user) {
                showMessage(messageEl, "is-error", "Credenciais invalidas. Verifique seus dados ou faca seu cadastro.");
                return;
            }

            setSession(user, remember);
            showMessage(messageEl, "is-success", "Login realizado com sucesso! Redirecionando...");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 800);
        });

        var activeSession = getSession();
        if (activeSession && activeSession.email) {
            showMessage(messageEl, "is-info", "Sessao encontrada para " + activeSession.email + ". Entre novamente ou siga para o painel.");
        }
    }

    function protectPages() {
        var path = window.location.pathname.toLowerCase();
        var authPages = ["/paginas/login.html", "/paginas/register.html"];
        var currentIsAuth = authPages.some(function (item) {
            return path.endsWith(item);
        });

        if (currentIsAuth) {
            return;
        }

        var session = getSession();
        if (!session || !session.email) {
            return;
        }

        var userNameTargets = document.querySelectorAll(".user-profile span");
        if (userNameTargets.length && session.name) {
            userNameTargets.forEach(function (el) {
                if (el.textContent && el.textContent.trim().length > 0) {
                    el.textContent = session.name;
                }
            });
        }
    }

    function init() {
        setupTogglePassword();
        setupRegisterForm();
        setupLoginForm();
        protectPages();
    }

    document.addEventListener("DOMContentLoaded", init);
})();
