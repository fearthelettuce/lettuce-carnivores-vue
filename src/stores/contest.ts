import { defineStore } from 'pinia'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/apis/firebase'
import { useUserStore } from './users';
import { ref, type Ref } from 'vue'
export const useContestStore = defineStore('contest', () => {
    const isContestActive = true;
    const isTestMode = true;
    const contestName = 'October2024Week1'
    const contestRules = 'Valid in the United States only. The winner will be contacted via their selected contact method and will need to respond within 7 calendar days with requested information, such as shipping address. Failing to provide a valid contact method, or failing to respond to the notification with the necessary information within 7 calendar days will void their claim to the prize. Odds are winning depend on the number of entries into the contest. No purchase necessary, and purchase will not increase odds of winning. Void where prohibited. '
    
    
    //contest specifics
    const password = 'ghost'
    //Digging through my code? Sneaky sneaky!
    const lettersArr: Ref<string[]> = ref([])
    const bypassGame = false

    function addLetter(letter: string) {
        lettersArr.value.push(letter.toLowerCase())
    }

    function checkAnswer(theAnswer: string, myLetters: string[]) {
        const myAnswer = myLetters.join('')
        return myAnswer.toLowerCase() == theAnswer.toLowerCase()
    }
    //winner details
    const contactMethods = ['Email', 'Instagram Message', 'Facebook Message']
    const selectedContactMethod = ''
    const contactMethodInput = ''
    const contactMethodPrivatePolicy = 'The contact information provided here will only be used as notification if you win.  This information will not be used for marketing, will not be sold or shared with any third parties, and will be deleted within 30 days of the close of the contest.'
    const shareWinPublicly = false
    const publicDisplayName = ''
    const publicNameMessage = 'If you win, is it ok to use your first name or to tag you on Instagram in a public post?'

    async function submitContestEntry(contest: string, selectedContactMethod: string, shareWinPublicly: boolean, publicDisplayName: string) {
        await setDoc(doc(db, 'contests/entries', '1'), 
        {
            userUID: useUserStore().user,
            contest: contest,
            selectedContactMethod: selectedContactMethod,
            shareWinPublicly: shareWinPublicly,
            publicDisplayName: publicDisplayName,
            bypassGame: bypassGame

        })

    }

    function isContestEntryValid() {
        
    }
    return {
        isContestActive,
        password,
        lettersArr
    }

})