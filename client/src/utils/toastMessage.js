const showToast = (status, title) => {
  const alertHTML = `<div class='alert alert--${status}'>${title}</div>`;

  document.body.insertAdjacentHTML('afterbegin', alertHTML);

  setTimeout(() => {
    const alert = document.querySelector('.alert');
    alert.remove();
  }, 3000);
};

export const showInfoToast = title => showToast('info', title);
export const showSuccessToast = title => showToast('success', title);
export const showWarningToast = title => showToast('warning', title);
export const showErrorToast = title => showToast('error', title);
