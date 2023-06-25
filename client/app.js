const form = document.querySelector('form')
const chatContainer = document.querySelector('.container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function loaderText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

function idGenerator() {
    const timestamp = Date.now();
    const randomNum = Math.random();
    const hexadecimalString = randomNum.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatDesign(isAi, value, uniId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? "./ressources/bot.png" : "./ressources/bot.png"} 
                      alt="${isAi ? 'bot' : 'person'}" 
                    />
                </div>
                <div class="message" id=${uniId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    
    chatContainer.innerHTML += chatDesign(false, data.get('prompt'))

    
    form.reset()

    
    const uniId = idGenerator()
    chatContainer.innerHTML += chatDesign(true, " ", uniId)

    
    chatContainer.scrollTop = chatContainer.scrollHeight;

    
    const messageDiv = document.getElementById(uniId)

    
    loader(messageDiv);

    const response = await fetch('https://dexten.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        loaderText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong, please try again!"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})