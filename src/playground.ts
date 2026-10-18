import './main';
import { Application } from '@splinetool/runtime';

const canvas = document.querySelector<HTMLCanvasElement>('#workspace-scene')!;
const shell = document.querySelector<HTMLElement>('.scene-shell')!;
const status = document.querySelector<HTMLElement>('.scene-status')!;
const message = status.querySelector('span')!;
const retry = status.querySelector('button')!;
let scene: Application | undefined;
const tapTriggers: Record<string, string> = {
  Mascot_Green: 'Mascot_Green_JumpTrigger', Mascot_Beige: 'Mascot_Beige_JumpTrigger',
  Chair: 'Chair_TrickTrigger', Notebook: 'Notebook_WriteTrigger', Phone: 'Phone_WakeTrigger',
  Laptop: 'Laptop_ClapTrigger', Monitor: 'Monitor_CasesTrigger', Lamp: 'Lamp_JumpTrigger',
  Wall_Art_Poster: 'Poster_SlipTrigger', Wall_Art_Painting: 'Painting_SlipTrigger',
};

async function loadScene() {
  shell.setAttribute('aria-busy', 'true');
  status.hidden = false;
  retry.hidden = true;
  message.textContent = 'Загружаю рабочее место…';
  try {
    scene?.dispose();
    scene = new Application(canvas);
    await scene.load('https://prod.spline.design/JoyvfF9wq5yyaDam/scene.splinecode?v=2026-10-18-mobile-clouds-v3');
    scene.setBackgroundColor('transparent');
    scene.setZoom(window.innerWidth <= 600 ? 0.82 : 1);
    const activeScene = scene;
    activeScene.addEventListener('mouseDown', (event) => {
      if (!window.matchMedia('(any-pointer: coarse)').matches) return;
      const trigger = tapTriggers[event.target.name];
      if (trigger) activeScene.setVariable(trigger, Number(activeScene.getVariable(trigger) || 0) + 1);
    });
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
window.addEventListener('resize', () => requestAnimationFrame(() => scene?.setZoom(window.innerWidth <= 600 ? 0.82 : 1)));
void loadScene();
