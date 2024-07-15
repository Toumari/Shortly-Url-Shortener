const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile__menu");
const linkGrid = document.querySelector(".link-grid");
const shortenSubmitBtn = document.querySelector(".shorten__submit");
const shortenInput = document.querySelector(".link__input");
const error = document.querySelector(".error");

let shortenedUrls = localStorage.getItem("shortenedUrls")
  ? JSON.parse(localStorage.getItem("shortenedUrls"))
  : [];

hamburger.addEventListener("click", (e) => {
  mobileMenu.classList.toggle("hidden");
});

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

shortenSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const newEntry = document.createElement("div");
  newEntry.classList.add("link__card");

  async function shortenUrl() {
    if (!isValidUrl(shortenInput.value || shortenInput.value === "")) {
      shortenInput.style.border = "2px solid red";
      error.innerHTML = "Please add a valid link";
      shortenInput.value = "";
      return;
    }
    shortenInput.style.border = "none";
    try {
      const response = await fetch("https://smolurl.com/api/links", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: `${shortenInput.value}`,
        }),
      });

      const data = await response.json();
      const url = data.data.short_url;
      shortenedUrls = [
        ...shortenedUrls,
        { original: shortenInput.value, shortened: url },
      ];

      localStorage.setItem("shortenedUrls", JSON.stringify(shortenedUrls));

      console.log(shortenedUrls);

      linkGrid.innerHTML = "";

      shortenedUrls.forEach((url) => {
        const newEntry = document.createElement("div");
        newEntry.classList.add("link__card");

        newEntry.innerHTML += `
      <h4 class="card__url">${url.original}</h4>
              <div class="card__line"></div>
              <div class="card__right">
                <h4 class="card__shortened__url">${url.shortened}</h4>
                <button class="shorten__btn btn">Copy</button>
              </div>
    `;
        linkGrid.appendChild(newEntry);

        const copyBtn = newEntry.querySelector(".shorten__btn");

        copyBtn.addEventListener("click", (e) => {
          navigator.clipboard.writeText(url.shortened);
          copyBtn.innerHTML = "Copied!";
          copyBtn.style.backgroundColor = "hsl(257, 27%, 26%)";
        });
      });

      shortenInput.value = "";
    } catch (error) {
      console.error("Error:", error);
    }
  }

  shortenUrl();
});

const render = () => {
  shortenedUrls.forEach((url) => {
    const newEntry = document.createElement("div");
    newEntry.classList.add("link__card");

    newEntry.innerHTML += `
  <h4 class="card__url">${url.original}</h4>
          <div class="card__line"></div>
          <div class="card__right">
            <h4 class="card__shortened__url">${url.shortened}</h4>
            <button class="shorten__btn btn">Copy</button>
          </div>
`;
    linkGrid.appendChild(newEntry);

    const copyBtn = newEntry.querySelector(".shorten__btn");

    copyBtn.addEventListener("click", (e) => {
      navigator.clipboard.writeText(url.shortened);
      copyBtn.innerHTML = "Copied!";
      copyBtn.style.backgroundColor = "hsl(257, 27%, 26%)";
    });
  });
};

render();
