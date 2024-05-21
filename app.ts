// Interface to define the structure of an image data
interface ImageData {
    urls: { regular: string };
    alt_description: string;
  }
  
  // Main block that initializes event listeners and handlers
  document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('cover')?.querySelector('form') as HTMLFormElement;
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const gallery = document.getElementById('image-gallery') as HTMLElement;
    const hotKeywords = document.querySelectorAll('.hot-keyword') as NodeListOf<HTMLElement>;
  
    // Event listener for form submission
    form.addEventListener('submit', function(event: Event) {
      event.preventDefault();
      performSearch(searchInput.value.trim());
    });
  
    // Event listener for keyword clicks
    hotKeywords.forEach(keyword => {
      keyword.addEventListener('click', function() {
        searchInput.value = keyword.textContent || '';
        performSearch(searchInput.value);
      });
    });
  
    // Function to perform the search and fetch images
    function performSearch(query: string): void {
      const accessKey = "ZbDbaDiQO3NFU2JPM0HGyhV1lxs4HkhrCo9qPnBdDbU"; // Replace with your actual Unsplash access key
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}`;
  
      fetch(url)
        .then((response: Response) => response.json())
        .then((data: { results: ImageData[] }) => {
          displayImages(data.results);
        })
        .catch((error: Error) => {
          console.error('Error fetching images:', error);
          alert('Failed to fetch images');
        });
    }
  
    // Function to display images in the gallery
    function displayImages(images: ImageData[]): void {
      gallery.innerHTML = '';
      images.forEach(image => {
        const imgElement = document.createElement('div');
        imgElement.className = 'column';
        imgElement.innerHTML = `<img class="lazy" data-src="${image.urls.regular}" src="placeholder.jpg" alt="${image.alt_description}" style="width:100%; height:350px;">`;
        gallery.appendChild(imgElement);
      });
      initializeLazyLoad();
    }
  
    // Function to initialize lazy loading using Intersection Observer
    function initializeLazyLoad(): void {
      const lazyloadImages = document.querySelectorAll("img.lazy") as NodeListOf<HTMLImageElement>;
      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '0px',
        threshold: 0.1
      });
  
      lazyloadImages.forEach(img => observer.observe(img));
    }
  });  