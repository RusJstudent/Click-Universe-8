export {openMenu, openMenuSection, showEquipItems, addEquipItem, selectEquipItem};

const menuEquipSelected = document.querySelector('.equip__selected');
const menuEquipSell = document.querySelector('.equip__sell');

function openMenu(e, menu) {
    let displayStatus = getComputedStyle(menu).display;
    if (displayStatus === 'none') {
        menu.style.display = 'grid';
    } else {
        menu.style.display = 'none';
    }
}

function openMenuSection(e, menu, menuNavigation) {
    let target = e.target.closest('.menu__nav-elem');
    if (!target || !menuNavigation.contains(target)) return;

    menuEquipSelected.textContent = '';
    menuEquipSell.style.display = 'none';

    menu.querySelectorAll('.menu__section').forEach(section => {
        section.style.display = 'none';
    });

    const className = target.classList[1].slice(10);
    const section = menu.querySelector(`.menu__${className}`);
    section.style.display = 'flex';
}

let equipIsShowed = false;
function showEquipItems(user, menuEquipGuns, menuEquipShields) {
    if (equipIsShowed) return;
    equipIsShowed = true;

    const guns = {};
    const shields = {};

    for (let item in user.equip) {
        if (item.startsWith('lg')) {
            guns[item] = user.equip[item];
        }
        if (item.startsWith('db')) {
            shields[item] = user.equip[item];
        }
    }

    for (let gun in guns) {
        if (guns[gun] === 0) continue;
        for (let i = 0; i < guns[gun]; i++) {
            const lg = document.createElement('img');
            lg.style.width = '60';
            lg.style.height = '60';
            lg.src = `images/equipment/${gun}.png`;
            menuEquipGuns.prepend(lg);
        }
    }

    for (let shield in shields) {
        if (shields[shield] === 0) continue;
        for (let i = 0; i < shields[shield]; i++) {
            const db = document.createElement('img');
            db.style.width = '60';
            db.style.height = '60';
            db.src = `images/equipment/${shield}.png`;
            menuEquipShields.prepend(db);
        }
    }
}

function addEquipItem(itemName, itemType, menuEquipGuns, menuEquipShields) {
    if (itemType === 'lg') {
        const lg = document.createElement('img');
        lg.style.width = '60';
        lg.style.height = '60';
        lg.src = `images/equipment/${itemName}.png`;
        menuEquipGuns.append(lg);


    } else if (itemType === 'db') {
        const db = document.createElement('img');
        db.style.width = '60';
        db.style.height = '60';
        db.src = `images/equipment/${itemName}.png`;
        menuEquipShields.append(db);
    }
}

function selectEquipItem(e, menuEquip, user, equip, updateHp, displayProfileInfo, ranks, saveData) {
    const target = e.target;
    if (target.tagName !== 'IMG') return;

    const src = target.getAttribute('src');
    if (!src.includes('lg') && !src.includes('db')) return;

    const idx = src.lastIndexOf('/');
    const itemName = src.substr(idx + 1, 3);

    menuEquipSelected.textContent = itemName;
    menuEquipSell.style.display = 'block';

    menuEquipSell.onclick = e => {
        sellEquipItem(e, menuEquip, user, equip, updateHp, displayProfileInfo, ranks, saveData, itemName);
    }
}

function sellEquipItem(e, menuEquip, user, equip, updateHp, displayProfileInfo, ranks, saveData, itemName) {
    const itemType = itemName.slice(0, 2);

    if (user.equip[itemName] === 0) {
        alert(`You have no ${itemName}`);
        return;
    }

    if (itemType === 'lg') user.damage -= equip[itemName];
    if (itemType === 'db') user.maxSh -= equip[itemName];

    user.equip[itemName]--;

    if (itemType === 'db' && user.sh > user.maxSh) {
        user.sh = user.maxSh;
        updateHp();
    }

    displayProfileInfo(user, ranks);
    saveData();

    // удаляю нужную картинку
    let container = menuEquip.querySelector(`.equip__${itemType}`);
    let arr = Array.from(container.querySelectorAll('img'));
    arr.find( elem => elem.src.includes(itemName)).remove();
}