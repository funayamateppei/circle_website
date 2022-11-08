import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAL8_-e9Q7xvWLiwRr6vC9-9oOSImNtGeI",
  authDomain: "club-website-ad955.firebaseapp.com",
  projectId: "club-website-ad955",
  storageBucket: "club-website-ad955.appspot.com",
  messagingSenderId: "593932615380",
  appId: "1:593932615380:web:8e42ac287b01f592690541"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// 新規登録の処理
$('#signupBtn').on('click', () => {
  const email = $('#signupMail').val();
  const password = $('#signupPass').val();
  const password2 = $('#signupPass2').val();
  // 入力内容の漏れ確認
  if (email === '' || password === '') {
    $('.error').text('メールアドレス、パスワードを入力してください');
    return
  }
  // パスワード確認
  if (password !== password2) {
    $('.error').text('パスワードと確認用パスワードが一致しません。');
    return
  }

  // メールアドレス、パスワードの登録
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // 登録成功後に起こる処理
      // const user = userCredential.user;
      // console.log(user);
      alert('登録が完了しました。')
      $('.signup').hide();
      $('.home').fadeIn();
    })
    .catch((error) => {
      const errorCode = error.code;
      // メールアドレスの形じゃなかったエラー
      // すでに登録してある情報だったエラー
      if (errorCode === 'auth/invalid-email') {
        $('.error').text('メールアドレスの形で入力し、登録してください。');
        return
      } else if (errorCode === 'auth/email-already-in-use') {
        $('.error').text('現在すでに登録されています。ログインをするか別のメールアドレスで登録してください。');
        return
      }
      // console.log(errorCode); // if文の中でエラーコードを使用するため呼んだ
    });
})

// ログインの処理
$('#loginBtn').on('click', () => {
  const email = $('#loginMail').val();
  const password = $('#loginPass').val();
  if (email === '' || password === '') {
    alert('メールアドレス、パスワードを入力してください')
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // const user = userCredential.user;
      // ログイン成功時に起こる処理
      $('.login').hide();
      $('.home').fadeIn();
    })
    .catch((error) => {
      const errorCode = error.code;
      // メールアドレスの形じゃなかったエラー
      // 登録されていないメールアドレスだったエラー
      // メールアドレスはあるが、パスワードが違うエラー
      if (errorCode === 'auth/invalid-email') {
        $('.error').text('メールアドレスの形で入力し、ログインしてください。');
        return
      } else if (errorCode === 'auth/user-not-found') {
        $('.error').text('登録されていないメールアドレスです。');
      } else if (errorCode === 'auth/wrong-password') {
        $('.error').text('パスワードが違います。');
        return
      }
    });
})
