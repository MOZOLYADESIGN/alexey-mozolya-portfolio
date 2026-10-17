import './main';
import { Application } from '@splinetool/runtime';

const canvas = document.querySelector<HTMLCanvasElement>('#workspace-scene')!;
const shell = document.querySelector<HTMLElement>('.scene-shell')!;
const status = document.querySelector<HTMLElement>('.scene-status')!;
const message = status.querySelector('span')!;
const retry = status.querySelector('button')!;
let scene: Application | undefined;

async function loadScene() {
  shell.setAttribute('aria-busy', 'true');
  status.hidden = false;
  retry.hidden = true;
  message.textContent = 'Загружаю рабочее место…';
  try {
    scene?.dispose();
    scene = new Application(canvas);
    await scene.load('https://prod.spline.design/JoyvfF9wq5yyaDam/scene.splinecode');
    status.hidden = true;
    shell.dataset.loaded = 'true';
  } catch {
    scene?.dispose();
    scene = undefined;
    message.textContent = 'Не удалось загрузить 3D-сцену. Проверь соединение и попробуй ещё раз.';
    retry.hidden = false;
  } finally {
    shell.setAttribute('aria-busy', 'false');
  }
}

retry.addEventListener('click', loadScene);
window.addEventListener('pagehide', () => scene?.dispose());
void loadScene();
