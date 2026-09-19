(function () {
    function apply(theme) {
        document.documentElement.setAttribute("data-bs-theme", theme);
        // Keeps native scrollbars, form controls and date pickers in step with the theme.
        document.documentElement.style.colorScheme = theme;
    }
    try {
        var theme = localStorage.getItem("theme");
        apply(theme === "light" || theme === "dark" ? theme : "light");
    } catch (e) {
        apply("light");
    }
})();
