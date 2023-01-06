import './styles/index.scss';

const donuts = document.querySelectorAll('.donut');
let isActive = false;
let IntervalId;

const modalControlBnts = document.querySelectorAll('.modalBnt').forEach((btn) => {
  btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    document.querySelector('.modal').classList.toggle('hide');
  });
});

document.querySelector('#color-hex').addEventListener('click', (e) => {
  e.preventDefault();
  const customAlert = document.querySelector('.alert');
  customAlert.classList.add('active');
  setTimeout(() => {
    customAlert.classList.remove('active');
  }, 1000);
});

function copyOnClick(text) {
  return navigator.clipboard.writeText(text);
}

document.addEventListener('click', (event) => {
  const type = event.target.dataset.type;

  if (type === 'lock') {
    const node = event.target.tagName.toLowerCase() === 'i' ? event.target : event.target.children[0];

    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
  } else if (type === 'copy') {
    copyOnClick(event.target.textContent);
  }
});

function setTextColor(elements, color) {
  const luminance = chroma(color).luminance();
  elements.forEach((i) => {
    i.style.color = luminance > 0.7 ? 'black' : 'white';
  });
}

function updateColorHash(colors = []) {
  document.location.hash = colors.map((i) => i.toString().substring(1)).join('-');
}

function getColorsFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split('-')
      .map((color) => '#' + color);
  }
  return [];
}

function setRandomColors(isInitial) {
  const colors = isInitial ? getColorsFromHash() : [];

  donuts.forEach((don, index) => {
    const isLocked = don.querySelector('i').classList.contains('fa-lock');
    const textTitle = don.querySelector('h2');
    const button = don.querySelector('button');
    const frogEyes = don.querySelectorAll('.donut__eye');
    const frogBody = don.querySelector('.donut__wrapper');
    const frogMouth = don.querySelector('.donut__mouth');

    if (isLocked) {
      colors.push(textTitle.textContent);
      return;
    }

    const color = isInitial ? (colors[index] ? colors[index] : chroma.random()) : chroma.random();

    colors.push(color);

    textTitle.textContent = color;
    frogEyes.forEach((e) => (e.style.backgroundColor = color));
    frogBody.style.backgroundColor = color;
    frogMouth.style.backgroundColor = color;

    setTextColor([textTitle, button], color);
  });
  updateColorHash(colors);
}

const start = () => {
  IntervalId = setInterval(setRandomColors, 500);
};

const stop = () => {
  clearInterval(IntervalId);
};

const relaxClickHandler = () => {
  const hideContent = document.querySelectorAll('.color-code, .lock-btn');
  const btnControlPanel = document.querySelector('.btn-control-panel');
  if (!isActive) {
    start();
    isActive = true;
    hideContent.forEach((e) => {
      e.style.opacity = 0;
    });
    btnControlPanel.style.opacity = 0.3;
  } else if (isActive) {
    stop();
    isActive = false;
    hideContent.forEach((e) => {
      e.style.opacity = 1;
    });
    btnControlPanel.style.opacity = 1;
  }
};

document.getElementById('relaxControl').addEventListener('click', (e) => {
  e.preventDefault();
  relaxClickHandler();
});
document.getElementById('nextControl').addEventListener('click', (e) => {
  e.preventDefault();
  setRandomColors();
});

// document.addEventListener('keydown', (e) => {
//   e.preventDefault();
//   if (e.code === 'Space') {
//     spacePressing();
//   } else if (e.code === 'ArrowRight') {
//     setRandomColors();
//   }
// });

console.log(getColorsFromHash());

setRandomColors(true);
