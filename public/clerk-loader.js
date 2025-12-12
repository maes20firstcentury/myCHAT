let clerkLoaded = false;

export async function loadClerk(publishableKey) {
  if (clerkLoaded) return;

  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js";
  script.crossOrigin = "anonymous";
  script.async = true;

  script.onload = async () => {
    await window.Clerk.load({ publishableKey });
  };

  document.head.appendChild(script);
  clerkLoaded = true;
}
