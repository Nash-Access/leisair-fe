
const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
const smallAlphabet = 'useandompxbfghjklqvwyzrict5148923670'

export const newNanoId = (size = 21, alphabet: "small" | "normal" = "normal") => {
    const _alphabet = alphabet === "small" ? smallAlphabet : urlAlphabet
    let id = ''
    let i = size
    while (i--) {
      id += _alphabet[(Math.random() * _alphabet.length) | 0]
    }
    return id
}

export const newGuid = () => {
    let sGuid = "";
    for (let i = 0; i < 32; i++) {
        sGuid += Math.floor(Math.random() * 0xF).toString(0xF);
    }
    return sGuid;
}

export const newTimeBasedNanoId = (size = 21) => {
  // Generate timestamp-based half of the ID
  let id = getTimeBasedId()

  // Generate random half of the ID
  for (let i = 0; i < size -7; i++) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }

  return id
}

const getTimeBasedId = () => {
  let id = ''
  let time = Date.now()

  // Generate timestamp-based half of the ID
  for (let i = 0; i < 7; i++) {
    id = `${urlAlphabet[time % urlAlphabet.length] ?? ""}${id}`
    time = Math.floor(time / urlAlphabet.length)
  }

  return id
}