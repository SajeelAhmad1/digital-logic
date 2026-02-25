import React, { useEffect, useState } from 'react';

function SocialLogin({}) {
  const [csrf, setCsrf] = useState();

  useEffect(() => {
    fetch('/api/auth/csrf').then((d) => {
      d.json().then((r) => {
        setCsrf(r.csrfToken);
      });
    });
  }, []);

  return (
    <>
      <form action="/api/auth/signin/google" method="POST">
        <input type="hidden" name="csrfToken" value={csrf} />
        <input type="hidden" name="callbackUrl" value="/" />
        <button type="submit" className="button">
          <img
            loading="lazy"
            height="24"
            width="24"
            id="provider-logo"
            src="https://authjs.dev/img/providers/google.svg"
          />
          <span>Sign in with Google</span>
        </button>
      </form>
      <form action="/api/auth/signin/facebook" method="POST">
        <input type="hidden" name="csrfToken" value={csrf} />
        <input type="hidden" name="callbackUrl" value="/" />
        <button type="submit" className="button">
          <img
            loading="lazy"
            height="24"
            width="24"
            id="provider-logo"
            src="https://authjs.dev/img/providers/google.svg"
          />
          <span>Sign in with Facebook</span>
        </button>
      </form>
    </>
  );
}

export default SocialLogin;
