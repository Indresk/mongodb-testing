const paramItems = document.querySelectorAll(".param-item");
const currentUrl = new URL(window.location.href);
const hasCurrentParams = currentUrl.searchParams.toString().length > 0;

if(!hasCurrentParams){
  currentUrl.searchParams.set('page','1')
  currentUrl.searchParams.set('limit','10')
  currentUrl.searchParams.set('category','null')
  currentUrl.searchParams.set('status','null')
  currentUrl.searchParams.set('sortBy','null')
  currentUrl.searchParams.set('sortDir','null')
  currentUrl.searchParams.set('minPrice','null')
  currentUrl.searchParams.set('maxPrice','null')
  currentUrl.searchParams.set('stock','null')
}

paramItems.forEach((link) => {
  const urlNext = new URL(link.href);

  for (const [key, value] of currentUrl.searchParams.entries()) {
    if (!urlNext.searchParams.has(key)) {
      urlNext.searchParams.set(key, value);
    }
  }
  
  const button = link.querySelector("button");
  if (button) {
    button.classList.remove("active");
  }

  let isExactMatch = true;
  for (const [key, value] of currentUrl.searchParams.entries()) {
    if (urlNext.searchParams.get(key) !== value) {
      isExactMatch = false;
      break;
    }
  }

  if (isExactMatch && button) {
    button.classList.add("active");
  }

  link.href = urlNext.toString();
});
