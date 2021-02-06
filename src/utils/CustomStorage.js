const storage = window.localStorage;
const USER_KEY = "user-key";
const CARD_KEY_TODO = "card-key-todo";
const CARD_KEY_COMPLETE = "card-key-complete";
const TAG_KEY = "tag-key";

const UserStorage = {
  convertUser: (user) => {
    user = user.trim();

    let userWords = user.split(" ");
    console.log(userWords);
    userWords.forEach((word, index) => {
      const head = word[0];
      const left = word.slice(1);

      userWords[index] = head.toUpperCase() + left;
    });

    return userWords.join(" ");
  },

  isUserSigned: () => {
    const user = storage.getItem(USER_KEY);

    if (!user) return false;
    return true;
  },

  setUserData: (user) => {
    user = UserStorage.convertUser(user);
    storage.setItem(USER_KEY, user);
  },

  getUserData: () => {
    return storage.getItem(USER_KEY);
  },

  removeUserData: () => {
    storage.removeItem(USER_KEY);
    storage.removeItem(CARD_KEY_TODO);
    storage.removeItem(CARD_KEY_COMPLETE);
    storage.removeItem(TAG_KEY);
    window.location.reload();
  },
};

const CardStorage = {
  getAllCardFromTodo: () => {
    const data = JSON.parse(storage.getItem(CARD_KEY_TODO));

    if (!data || data.length === 0) return [];
    return data;
  },

  getAllCardFromComplete: () => {
    const data = JSON.parse(storage.getItem(CARD_KEY_COMPLETE));

    if (!data || data.length === 0) return [];
    return data;
  },

  addCardToTodo: (cardObj) => {
    const allCards = CardStorage.getAllCardFromTodo();

    const card = {
      tag: cardObj.tag,
      countdown: cardObj.countdown,
      text: cardObj.text,
      updatedAt: cardObj.updatedAt,
      salt: cardObj.salt,
      id: cardObj.id,
    };

    allCards.unshift(card);

    storage.setItem(CARD_KEY_TODO, JSON.stringify(allCards));
  },

  addCardToComplete: (cardObj) => {
    const allCards = CardStorage.getAllCardFromComplete();

    const card = {
      tag: cardObj.tag,
      countdown: cardObj.countdown,
      text: cardObj.text,
      updatedAt: cardObj.updatedAt,
      salt: cardObj.salt,
      id: cardObj.id,
    };

    allCards.unshift(card);

    storage.setItem(CARD_KEY_COMPLETE, JSON.stringify(allCards));
  },

  containsTodo: (id) => {
    id = parseInt(id);

    const allCards = CardStorage.getAllCardFromTodo();
    let idx = -1;

    for (let i = 0; i < allCards.length; i++) {
      if (allCards[i].id === id) {
        idx = i;
        break;
      }
    }

    return idx;
  },

  containsComplete: (id) => {
    id = parseInt(id);

    const allCards = CardStorage.getAllCardFromComplete();
    let idx = -1;

    for (let i = 0; i < allCards.length; i++) {
      if (allCards[i].id === id) {
        idx = i;
        break;
      }
    }

    return idx;
  },

  removeCardFromTodo: (id) => {
    id = parseInt(id);

    const allCards = CardStorage.getAllCardFromTodo();
    const idx = CardStorage.containsTodo(id);

    console.log(idx);

    if (idx === -1) return;

    allCards.splice(idx, 1);
    storage.setItem(CARD_KEY_TODO, JSON.stringify(allCards));
  },

  removeCardFromComplete: (id) => {
    id = parseInt(id);

    const allCards = CardStorage.getAllCardFromComplete();
    const idx = CardStorage.containsComplete(id);
    if (idx === -1) return;

    allCards.splice(idx, 1);
    storage.setItem(CARD_KEY_COMPLETE, JSON.stringify(allCards));
  },
};

const TagStorage = {
  getAllTags: () => {
    const data = JSON.parse(storage.getItem(TAG_KEY));

    if (!data || data.length === 0) return [];
    return data;
  },

  appendTag: (tagObj) => {
    const tagObjs = TagStorage.getAllTags();
    tagObjs.unshift(tagObj);

    storage.setItem(TAG_KEY, JSON.stringify(tagObjs));
  },

  removeTag: (tag) => {
    const tagObjs = TagStorage.getAllTags();
    const idx = TagStorage.contains(tag);
    if (idx === -1) return;

    tagObjs.splice(idx, 1);
    storage.setItem(TAG_KEY, JSON.stringify(tagObjs));
  },

  contains: (tag) => {
    const tagObjs = TagStorage.getAllTags();
    let idx = -1;

    for (let i = 0; i < tagObjs.length; i++) {
      if (tagObjs[i].text === tag) {
        idx = i;
        break;
      }
    }

    return idx;
  },

  getTagObj: (tag) => {
    const tagObjs = TagStorage.getAllTags();

    for (let i = 0; i < tagObjs.length; i++) {
      if (tagObjs[i].text === tag) {
        return tagObjs[i];
      }
    }

    return null;
  },

  removeCardId: (id) => {
    const tagObjs = TagStorage.getAllTags();

    const removed = tagObjs.map((tagObj) => {
      tagObj.cardId = tagObj.cardId.filter((cardId) => cardId !== parseInt(id));

      return tagObj;
    });

    storage.setItem(TAG_KEY, JSON.stringify(removed));
  },
};

export { UserStorage, CardStorage, TagStorage };
