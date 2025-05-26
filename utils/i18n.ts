import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      genres: {
        study: 'Study',
        nap: 'Nap',
        workout: 'Workout',
        work: 'Work',
      },
      modes: {
        focus: 'Focus Mode',
        strict: 'Strict Mode',
        focus_desc: 'A gentle mode for daily focus. You can pause or cancel anytime.',
        strict_desc: 'A strict mode for deep work. Pausing and canceling are restricted.',
        focus_link: 'What is Focus Mode?',
        strict_link: 'What is Strict Mode?',
      },
      timer: {
        focus: 'Focus',
        break: 'Break',
        start: 'Start',
        pause: 'Pause',
      },
      menu: {
        settings: 'Settings',
        howto: 'How to use',
        contact: 'Contact / Feedback',
        about: 'About this app',
      },
      howto: {
        title: 'How to use',
        desc: '1. Select a genre\n2. Choose a mode\n3. Start the timer and focus!\nYou can check your stats anytime.'
      },
      contact: {
        title: 'Contact / Feedback',
        desc: 'For questions or feedback, please contact us at: support@example.com'
      }
    }
  },
  ja: {
    translation: {
      genres: {
        study: '勉強',
        nap: '仮眠',
        workout: '筋トレ',
        work: '仕事',
      },
      modes: {
        focus: 'フォーカスモード',
        strict: 'ハードモード',
        focus_desc: '日常の集中に最適なやさしいモード。いつでも一時停止・キャンセル可能。',
        strict_desc: '本気の集中に最適な厳しいモード。一時停止やキャンセルが制限されます。',
        focus_link: 'フォーカスモードとは？',
        strict_link: 'ハードモードとは？',
      },
      timer: {
        focus: '集中',
        break: '休憩',
        start: 'スタート',
        pause: '一時停止',
      },
      menu: {
        settings: '設定',
        howto: '使い方',
        contact: '問い合わせ/ご意見',
        about: 'このアプリについて',
      },
      howto: {
        title: '使い方',
        desc: '1. ジャンルを選択\n2. モードを選択\n3. タイマーをスタートして集中！\n統計はいつでも確認できます。'
      },
      contact: {
        title: '問い合わせ/ご意見',
        desc: 'ご質問やご意見は support@example.com までご連絡ください。'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
