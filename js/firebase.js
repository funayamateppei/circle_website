import {
  initializeApp,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  doc,
  limit,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js"

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "club-website-ad955.firebaseapp.com",
  projectId: "club-website-ad955",
  storageBucket: "club-website-ad955.appspot.com",
  messagingSenderId: "593932615380",
  appId: "1:593932615380:web:8e42ac287b01f592690541"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)
const storageRef = ref(storage, 'club-image');

// -------------------------------------------------- 新規登録の処理
$('#signupBtn').on('click', () => {
  const username = $('#signupName').val();
  const email = $('#signupMail').val();
  const password = $('#signupPass').val();
  const password2 = $('#signupPass2').val();
  // 入力内容の漏れ確認
  if (username === '' || email === '' || password === '') {
    $('.error').text('ユーザー名、メールアドレス、パスワードを入力してください');
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
      const user = userCredential.user;
      // Firestoreにユーザー名、メールアドレス、uidを保存する
      addDoc(collection(db, 'users'), {
        username: username,
        email: user.email,
        uid: user.uid
      })
      alert('登録が完了しました。')
      $('#signupMail').val('');
      $('#signupPass').val('');
      $('.signup').hide();
      $('.login').fadeIn();
      $('.error').text('');
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
});



// ---------------------------------------------------- ログインの処理
$('#loginBtn').on('click', () => {
  const email = $('#loginMail').val();
  const password = $('#loginPass').val();
  if (email === '' || password === '') {
    alert('メールアドレス、パスワードを入力してください')
  }
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // const user = userCredential.user;
      // console.log(user.email);
      // ログイン成功時に起こる処理
      $('#loginMail').val('');
      $('#loginPass').val('');
      $('.login').hide();
      $('.top').hide();
      $('.mypage').hide();
      $('.home').fadeIn();
      $('header').fadeIn();
      $('.error').text('');
      // ログインしたときに２件だけ表示する（あとは検索して！）
      const q = query(collection(db, "users"), limit(2));
      const querySnapshot = await getDocs(q);
      const htmlElements = [];
      querySnapshot.forEach((doc) => {
        htmlElements.push(`
          <div class="item">
            <div class="name">
              <h2>${doc.data().club}</h2>
              <p>${doc.data().univ}</p>
            </div>
            <div class="description">
              <img src="${doc.data().img}">
              <div class="sentence">
                <p id="workDetail">活動内容</p>
                <p id="sentence">${doc.data().text}</p>
              </div>
            </div>
            <div class="snsLink">
              <a id="instaLink" target="_blank" 
                href="https://www.instagram.com/${doc.data().insta}/">
                <span class="fa-brands fa-instagram"></span> instagram</a>
              <a id="twitterLink" target="_blank" 
                href="https://twitter.com/${doc.data().twitter}/">
                <span class="fa-brands fa-twitter"></span> Twitter</a>
            </div>
          </div>
        `)
      })
      htmlElements.forEach(() => {
        $('.homeItem').html(htmlElements);
      })
      querySnapshot.forEach((doc) => {
        // もしデータが入っていたら表示する（入っていなかったら隠す）
        if (doc.data().insta === "") {
          $('#instaLink').hide();
        }
        if (doc.data().twitter === "") {
          $('#twitterLink').hide();
        }
      })
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
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    }
  });
})



// ログアウトの処理
$('#logout').on('click', () => {
  signOut(auth)
    .then(() => {
      alert('ログアウトしました。');
      $('.home').hide();
      $('header').hide();
      $('.mypage').hide();
      $('.login').fadeIn();
      $('.top').fadeIn();
      $('.item').remove();
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    })
})




let documentId = '';
// firestoreに情報追加
$('.submit button').on('click', () => {
  // フォームの内容をfirestoreに保存する
  // storageに画像保存
  const files = document.getElementById('imgForm').files
  console.log(files[0]); // 確認しとけい
  const imgfiles = ref(storageRef, files[0].name);
  uploadBytes(imgfiles, files[0])
    .then((snapshot) => {
      // storageに保存した画像のURLをもってくる imageタグのsrc属性で使うため
      getDownloadURL(imgfiles).then((url) => {
        console.log(url);
        const imgURL = url; // 定数に入れておく

        // userのuidが欲しいから、今ログインしているuserの状況を取得する
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const uid = user.uid;
            console.log(uid);
            // 取得したuidとusersコレクションの中のuidプロパティが一致するドキュメントID取得
            getDocs(query((collection(db, 'users')), where('uid', '==', uid)))
              .then(snapshot => {
                console.log(snapshot);
                snapshot.forEach(doc => {   // ここがなんで繰り返してんのかまじわからんゴミ
                  console.log(`${doc.id}`);
                  // グローバルで定義した空のdocumentIdに戻り値として渡す
                  return documentId = doc.id;
                })
                // 取得したドキュメントIDを指定して中身にdataを追加する
                // 第三引数にmerge: trueを入れることで元からあったものが消えない
                // updateDoc()でもよかった？わからんからこっち使った！
                setDoc(doc(db, 'users', documentId), {
                  univ: $('#univName').val(),
                  club: $('#clubName').val(),
                  text: $('#text').val(),
                  img: imgURL,  // さっき取得したstorageに保存した画像のURL
                  insta: $('#insta').val(),
                  twitter: $('#twitter').val()
                }, { merge: true })
                alert('データの送信が完了しました。')
              })
          }
        });
      })
    })
});


// マイページへ移動したときに起きる処理（ログインユーザーに登録してある情報を表示）
$('#mypage').on('click', () => {
  $('#univName').val('');
  $('#clubName').val('');
  $('#text').val('');
  $('#imgForm').val('');
  $('#insta').val('');
  $('#twitter').val('');
  // userのuidが欲しいから、今ログインしているuserの状況を取得する
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
      // 取得したuidとusersコレクションの中のuidプロパティが一致するドキュメントID取得
      getDocs(query((collection(db, 'users')), where('uid', '==', uid)))
        .then(async snapshot => {
          console.log(snapshot);
          snapshot.forEach(doc => {   // ここが何を繰り返してんのかわからんゴミ
            console.log(`${doc.id}`);
            // グローバルで定義した空のdocumentIdに戻り値として渡す
            return documentId = doc.id;
          })
          const docRef = doc(db, 'users', documentId);
          const docSnap = await getDoc(docRef);
          console.log(docSnap.data());
          const htmlElements = [];
          htmlElements.push(`
            <h2>ユーザー名 : ${docSnap.data().username}</h2>
            <p>メールアドレス : ${docSnap.data().email}</p>
            <div class="item">
              <div class="name">
                <h2>${docSnap.data().club}</h2>
                <p>${docSnap.data().univ}</p>
              </div>
              <div class="description">
                <img src="${docSnap.data().img}">
                <div class="sentence">
                  <p id="workDetail">活動内容</p>
                  <p id="sentence">${docSnap.data().text}</p>
                </div>
              </div>
              <div class="snsLink">
                <a id="instaLink" target="_blank" 
                  href="https://www.instagram.com/${docSnap.data().insta}/">
                  <span class="fa-brands fa-instagram"></span> instagram</a>
                <a id="twitterLink" target="_blank" 
                  href="https://twitter.com/${docSnap.data().twitter}/">
                  <span class="fa-brands fa-twitter"></span> Twitter</a>
              </div>
            </div>
          `)
          $('.mypageItem').html(htmlElements);
          console.log(docSnap.data().insta)
          // もしデータが入っていたら表示する（入っていなかったら隠す）
          if (docSnap.data().insta === "") {
            $('#instaLink').hide();
          }
          if (docSnap.data().twitter === "") {
            $('#twitterLink').hide();
          }
        })
    }
  })
  $('.home').hide();
  $('#mypage').hide();
  $('.mypage').fadeIn();
  $('#home').fadeIn();
  $('.update').text('内容を変更したい方はこちら');
  $('.submit p').hide();
})


// HOMEに戻るボタンを押したときにマイページを非表示にしてHOMEを表示する
$('#home').on('click', () => {
  $('#home').hide();
  $('.mypage').hide();
  $('.home').fadeIn();
  $('#mypage').fadeIn();
  $('.update').text('掲載したい方はこちら');
  $('.submit p').fadeIn();
})


// HOMEを開いたときに、ランダムで５件ずつ表示する機能



// 検索機能
$('.collegeName').on('click', async () => {
  const str = $('#collegeName').val();
  const q = query(collection(db, "users"), where("univ", "==", str));
  const querySnapshot = await getDocs(q);
  const htmlElements = [];
  querySnapshot.forEach((doc) => {
    htmlElements.push(`
      <div class="item">
        <div class="name">
          <h2>${doc.data().club}</h2>
          <p>${doc.data().univ}</p>
        </div>
        <div class="description">
          <img src="${doc.data().img}">
          <div class="sentence">
            <p id="workDetail">活動内容</p>
            <p id="sentence">${doc.data().text}</p>
          </div>
        </div>
        <div class="snsLink">
          <a id="instaLink" target="_blank" 
            href="https://www.instagram.com/${doc.data().insta}/">
            <span class="fa-brands fa-instagram"></span> instagram</a>
          <a id="twitterLink" target="_blank" 
            href="https://twitter.com/${doc.data().twitter}/">
            <span class="fa-brands fa-twitter"></span> Twitter</a>
        </div>
      </div>
    `)
  })
  htmlElements.forEach(() => {
    $('.homeItem').html(htmlElements);
  })
  querySnapshot.forEach((doc) => {
    // もしデータが入っていたら表示する（入っていなかったら隠す）
    if (doc.data().insta === "") {
      $('#instaLink').hide();
    }
    if (doc.data().twitter === "") {
      $('#twitterLink').hide();
    }
  })
})


  // アカウント削除機能ができなかった