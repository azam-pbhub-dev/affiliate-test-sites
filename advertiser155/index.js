const logEl = document.getElementById('log');
const subidDisplay = document.getElementById('subid-display');
const apiDisplay = document.getElementById('api-display');
const fireBtn = document.getElementById('fire-conversion');
const buttonStatus = document.getElementById('button-status');

// API base URL - always use production API
function getApiBaseUrl() {
	return 'https://api.stepstoshop.com';
}

const defaultApiBase = getApiBaseUrl();
document.getElementById('api-base').value = defaultApiBase;
apiDisplay.textContent = defaultApiBase;

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(str) {
	return str && uuidRegex.test(str);
}

// Random order helpers
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOrderId() {
	return `ORDER-${randomInt(1000, 9999)}`;
}

function generateOrderValue() {
	// random float between 500 and 8000 with 2 decimals
	return (Math.random() * (8000 - 500) + 500).toFixed(2);
}

function setRandomOrderFields() {
	const orderIdEl = document.getElementById('order-id');
	const orderValueEl = document.getElementById('order-value');
	if (orderIdEl) orderIdEl.value = generateOrderId();
	if (orderValueEl) orderValueEl.value = generateOrderValue();
}

function updateButtonStatus(hasValidSubid) {
	if (hasValidSubid) {
		buttonStatus.textContent = '✅ Ready to fire conversion. Click the button above to POST to /conversions.';
		buttonStatus.style.color = '#4ade80';
	} else {
		buttonStatus.textContent = '⚠️ Button disabled: No valid subid found. Click your short link to arrive here with ?subid={click_id}, or paste a valid UUID in the "Manual Subid Override" field above.';
		buttonStatus.style.color = '#fbbf24';
	}
}

const urlParams = new URLSearchParams(window.location.search);
const subid = urlParams.get('subid');
if (subid && isValidUUID(subid)) {
	localStorage.setItem('affiliate_subid', subid);
} else if (subid) {
	// Invalid subid in URL, clear localStorage
	localStorage.removeItem('affiliate_subid');
}

const storedSubid = localStorage.getItem('affiliate_subid');
const currentSubid = isValidUUID(storedSubid) ? storedSubid : null;

if (!currentSubid && storedSubid) {
	// Clear invalid stored subid
	localStorage.removeItem('affiliate_subid');
}

subidDisplay.textContent = currentSubid || 'N/A';
document.getElementById('subid-input').value = currentSubid || '';
fireBtn.disabled = !currentSubid;
updateButtonStatus(!!currentSubid);

// If there's an initial valid subid, generate order fields
if (currentSubid) {
	setRandomOrderFields();
}

// Update button state when manual subid is entered
document.getElementById('subid-input').addEventListener('input', (e) => {
	const inputValue = e.target.value.trim();
	const isValid = isValidUUID(inputValue);
	fireBtn.disabled = !isValid;
	updateButtonStatus(isValid);
	if (isValid) {
		localStorage.setItem('affiliate_subid', inputValue);
		subidDisplay.textContent = inputValue;
		// generate new random order id & value whenever subid changes to a valid UUID
		setRandomOrderFields();
	} else if (inputValue === '') {
		fireBtn.disabled = true;
		subidDisplay.textContent = 'N/A';
		updateButtonStatus(false);
	}
});

function log(msg) {
	logEl.textContent = msg;
}

document.getElementById('fire-conversion').addEventListener('click', async () => {
	const apiBase = document.getElementById('api-base').value.trim() || 'https://api.stepstoshop.com';
	apiDisplay.textContent = apiBase;
	const manualSubid = document.getElementById('subid-input').value.trim() || localStorage.getItem('affiliate_subid');

	if (!manualSubid || !isValidUUID(manualSubid)) {
		log('❌ Invalid or missing subid. Must be a valid UUID. Arrive via short link or paste a valid subid above.');
		fireBtn.disabled = true;
		updateButtonStatus(false);
		return;
	}

	const amountValue = document.getElementById('amount').value.trim();
	const body = {
		subid: manualSubid,
		currency: document.getElementById('currency').value || 'USD',
		orderId: document.getElementById('order-id').value,
		orderValue: parseFloat(document.getElementById('order-value').value),
		status: 'pending'
	};

	// Only include amount if provided (it's optional)
	if (amountValue) {
		body.amount = parseFloat(amountValue);
	}

	// Clear log and show loading state
	log('⏳ Sending request...');

	try {
		const res = await fetch(`${apiBase}/conversions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const json = await res.json();
		// Show only the last response
		if (res.ok) {
			log(`✅ Success ${res.status}:\n\n${JSON.stringify(json, null, 2)}\n\n💡 Note: Backend calculated commission from campaign settings.\n   Check response metadata for network margin details.`);
		} else {
			log(`❌ Error ${res.status}:\n\n${JSON.stringify(json, null, 2)}`);
		}
	} catch (err) {
		log(`Error: ${err.message}`);
	}
});

