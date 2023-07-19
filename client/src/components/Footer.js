function Footer() {
  const date = new Date().getFullYear();
  const repo = "https://github.com/escowin/job-tracker";

  const handleClick = () => window.open(repo, "_blank");

  return (
    <footer>
      <p className="link" onClick={handleClick}>
        &copy; {date} Edwin m. escobar
      </p>
    </footer>
  );
}

export default Footer;
