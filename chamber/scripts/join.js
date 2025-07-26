// Modal content
const modal_np = document.getElementById('modal-np');
const modal_bronze = document.getElementById('modal-bronze');
const modal_silver = document.getElementById('modal-silver');
const modal_gold = document.getElementById('modal-gold');

// Modal Btn Open
const btn_open_np = document.getElementById('btn-open-np');
const btn_open_bronze = document.getElementById('btn-open-bronze');
const btn_open_silver = document.getElementById('btn-open-silver');
const btn_open_gold = document.getElementById('btn-open-gold');

// Modal Btn Close
const btn_close_np = document.getElementById('btn-close-np');
const btn_close_bronze = document.getElementById('btn-close-bronze');
const btn_close_silver = document.getElementById('btn-close-silver');
const btn_close_gold = document.getElementById('btn-close-gold');

// NP
btn_open_np.addEventListener('click', () => {
  modal_np.showModal();
});
btn_close_np.addEventListener('click', () => {
  modal_np.close();
});

// Bronze
btn_open_bronze.addEventListener('click', () => {
  modal_bronze.showModal();
});
btn_close_bronze.addEventListener('click', () => {
  modal_bronze.close();
});

// Silver
btn_open_silver.addEventListener('click', () => {
  modal_silver.showModal();
});
btn_close_silver.addEventListener('click', () => {
  modal_silver.close();
});

// Gold
btn_open_gold.addEventListener('click', () => {
  modal_gold.showModal();
});
btn_close_gold.addEventListener('click', () => {
  modal_gold.close();
});
