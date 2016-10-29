import { Utils, iterateOverNodelist } from './utils';
import { SocialPolicy } from './socialpolicy';
import Collection = require('./collection');
import { notify } from './notify';

const u = new Utils();

export function addCulture(playerCiv) {
	let cultureUpgrades = u.elt('.can-purchase-culture-upgrades');

}

export function createCultureCardSlots (playerCiv) {
	let selCultureCards = u.elt('.selected-culture-cards');
	selCultureCards.innerHTML = '';
	for (let i = 0; i < playerCiv.socialPolicySlots; i++) {
		selCultureCards.innerHTML += `
			<div class='culture-card empty card-drop'>
        <span>Empty</span>
      </div>
		`;
	}
}

export function populateCultureCards (socialPolicies:Collection<SocialPolicy>) {
	let cultureCards = u.elt('.culture-cards');
  cultureCards.innerHTML = '';

  for (let i = 0; i < socialPolicies.items.length; i++) {
    let cc = socialPolicies.items[i];
    cultureCards.innerHTML += `
    <div class='culture-card' data-name='${cc.name}' draggable='true' data-type='${cc.category}' data-unlocked='${cc.unlocked}' data-active='${cc.active}'>
      <span class='culture-card-name'>
      	${cc.name}
      </span>
      <span class='culture-card-description'>
      	${cc.description}
      </span>
      <span class='culture-card-cost'>
      	<img src='img/culture.png'> ${cc.cost}
      </span>
    </div>
    `;
  }
}

let dragged;

export function cultureCardEvents(socialPolicies:Collection<SocialPolicy>) {
	let cc = u.elt('.culture-card', true);
	iterateOverNodelist(cc, (item, index) => {
		let cardName = item.getAttribute('data-name');
		let card = socialPolicies.get(cardName);

		
		item.addEventListener('click', () => {
			if (!card.unlocked) {
				card.unlocked = true;
				item.setAttribute('data-unlocked', 'true');
			} else {
				console.log('Card is already unlocked');
			}
		});

		item.addEventListener('dblclick', () => {
			let isSlotted = item.getAttribute('data-in-slot') === 'true' ? true : false;
			let cardName = item.getAttribute('data-name');
			console.log(isSlotted, cardName);
			if (isSlotted) {
				item.innerHTML = '<span>Empty</span>';
			}
		});

		item.addEventListener('dragstart', (event) => {
			if (card.unlocked && !card.active) {
				//event.dataTransfer.dropEffect = 'copy';
				dragged = card;
				console.log(dragged);
			} else {
				if (card.active) {
					notify({ message: `That Social Policy is already active!`}, true);
				} else {
					notify({ message: `You do not have that Social Policy yet!`}, true);
				}
				
			}
			
		});

		item.addEventListener('drag', (event) => {

		});

		item.addEventListener('dragenter', (event) => {
			event.preventDefault();
			//console.log(event);
		});

		item.addEventListener('dragover', (event) => {
			console.log('dragover event');
			//event.target.style.background = '#777';
			event.preventDefault();
		});

		item.addEventListener('dragleave', (event) => {
			event.preventDefault();
			//console.log(event);
		});

		item.addEventListener('drop', (event) => {

			//if (event.target.classList.contains('drop-card')) {
			if (event.target.className === 'culture-card empty card-drop') {
				event.preventDefault();
				
				//event.target.innerHTML = '';

				if (dragged === null) return;

				event.target.innerHTML = '';
				event.target.innerHTML = `
				
		      <span class='culture-card-name'>
		      	${dragged.name}
		      </span>
		      <span class='culture-card-description'>
		      	${dragged.description}
		      </span>
		      <span class='culture-card-cost'>
		      	<img src='img/culture.png'> ${dragged.cost}
		      </span>
		    
		    `;

		    event.target.classList.remove('empty');
		    event.target.setAttribute('data-name', dragged.name);
		    event.target.setAttribute('data-type', dragged.category);
		    event.target.setAttribute('data-unlocked', dragged.unlocked);
		   	event.target.setAttribute('data-active', 'true');
		   	event.target.setAttribute('data-in-slot', 'true');

		    

		    dragged.active = true;

		    dragged = null;
		  }
				

			//}
			
		})

		

		

	}, this);

	// let scc = u.elt('.selected-culture-cards .culture-card', true);
	// iterateOverNodelist(scc, (item, index) => {
	// 	console.log(index, item);
	// 	item.addEventListener('drop', (event) => {
	// 		event.preventDefault();
	// 		console.log(event.dataTransfer);
	// 		event.target.appendChild(dragged);
	// 		item.style.background = 'white';
	// 	});
	// }, this);
}
