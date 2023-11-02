import { useEffect } from "react";

function Page404({ setMain }) {
  useEffect(() => setMain("page-404"), [setMain]);

  return <section class="message">404 Page not found</section>;
}

export default Page404;
