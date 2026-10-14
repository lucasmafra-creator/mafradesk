const byId = (id) => document.getElementById(id);
const deviceId = byId('device-id');
const codeValue = byId('temporary-code');
const countdown = byId('countdown');
const codeState = byId('code-state');
const toast = byId('toast');

byId('current-date').textContent = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
}).format(new Date());

let currentInfo;
let toastTimer;

function formatId(value) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function renderCodeState() {
  if (!currentInfo) return;
  const secondsLeft = Math.max(0, Math.ceil((currentInfo.expiresAt - Date.now()) / 1000));
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  countdown.textContent = `${minutes}:${seconds}`;

  const expired = secondsLeft === 0;
  codeState.classList.toggle('expired', expired);
  codeState.innerHTML = expired
    ? '<i></i> Código expirado'
    : `<i></i> Expira em <b id="countdown">${minutes}:${seconds}</b>`;
  codeValue.textContent = expired ? 'Gere um novo código' : currentInfo.temporaryCode;
}

async function loadSessionInfo() {
  currentInfo = await window.mafraDesk.getLocalSessionInfo();
  deviceId.textContent = formatId(currentInfo.id);
  renderCodeState();
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const result = await window.mafraDesk.copySessionField(button.dataset.copy);
    showToast(result.copied ? 'Copiado para a área de transferência.' : 'Esse código expirou. Gere outro para continuar.');
  });
});

byId('refresh-code').addEventListener('click', async () => {
  const result = await window.mafraDesk.rotateTemporaryCode();
  currentInfo = { ...currentInfo, ...result };
  renderCodeState();
  showToast('Novo código temporário gerado.');
});

byId('connect-form').addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('A conexão remota será ativada em uma próxima etapa.');
});

loadSessionInfo().catch(() => showToast('Não foi possível carregar os dados locais. Reinicie o MafraDesk.'));
setInterval(renderCodeState, 1000);
