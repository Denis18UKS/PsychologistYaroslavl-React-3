import React from 'react';
import './styles.css';

const CONFIG = {
  name: 'Анна Лебедева',
  specialty: 'Психолог • Ярославль',
  telegram: 'https://t.me/your_username',
  email: 'hello@example.com',
  phone: '+7 (900) 000-00-00',
};

const requests = [
  ['01', 'Тревога и перегрузка', 'Когда мыслей слишком много, а сил — слишком мало.'],
  ['02', 'Отношения и границы', 'Конфликты, близость, одиночество и честный разговор с собой.'],
  ['03', 'Самооценка', 'Меньше внутреннего критика, больше опоры и ясности.'],
  ['04', 'Выгорание', 'Возвращение энергии, ритма и ощущения, что жизнь снова ваша.'],
];

const faqs = [
  ['Как проходит первая встреча?', 'Сначала знакомимся, уточняем ваш запрос и вместе определяем, с чего лучше начать. Никаких обязательств продолжать после первой встречи нет.'],
  ['Можно ли заниматься онлайн?', 'Да. Онлайн-консультации проходят по видеосвязи, из спокойного и приватного пространства.'],
  ['Сколько длится консультация?', '50 минут. Стоимость одной встречи — 3 500 ₽.'],
  ['Как часто встречаться?', 'Чаще всего — раз в неделю. Но ритм подбирается под ваш запрос, состояние и возможности.'],
];

function Icon({name, size=20}){
  const common={width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true};
  const p={
    sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon:<><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z"/></>,
    arrow:<><path d="M5 12h13"/><path d="m13 6 6 6-6 6"/></>,
    check:<><path d="m5 12 4 4L19 6"/></>,
    spark:<><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></>,
    pin:<><path d="M20 10.2c0 5-8 11-8 11S4 15.2 4 10.2a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  };
  return <svg {...common}>{p[name]}</svg>
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={theme:localStorage.getItem('psy-theme')||'light',open:null,sent:false,form:{name:'',contact:'',request:''}};
  }
  componentDidMount(){ this.applyTheme(); this.reveal(); }
  componentDidUpdate(prevProps,prevState){ if(prevState.theme!==this.state.theme)this.applyTheme(); }
  applyTheme(){ document.documentElement.dataset.theme=this.state.theme; localStorage.setItem('psy-theme',this.state.theme); }
  reveal(){
    const els=document.querySelectorAll('[data-reveal]');
    if(!window.IntersectionObserver){ els.forEach(el=>el.classList.add('is-visible')); return; }
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target);} }),{threshold:0.12});
    els.forEach(el=>obs.observe(el));
  }
  submit(e){
    e.preventDefault();
    const f=this.state.form;
    const text='Здравствуйте! Хочу записаться на консультацию.\nИмя: '+(f.name||'—')+'\nКонтакт: '+(f.contact||'—')+'\nЗапрос: '+(f.request||'—');
    this.setState({sent:true});
    window.open(CONFIG.telegram+'?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
  }
  render(){
    const state=this.state, theme=state.theme, open=state.open, sent=state.sent, form=state.form;
    return <div className="page">
      <header className="nav wrap">
        <a className="brand" href="#top"><span className="brand-mark"><Icon name="spark" size={17}/></span><span>{CONFIG.name}</span></a>
        <nav className="nav-links"><a href="#about">Обо мне</a><a href="#requests">Запросы</a><a href="#format">Формат</a><a href="#faq">FAQ</a></nav>
        <div className="nav-actions">
          <button className="theme-toggle" aria-label="Переключить тему" onClick={()=>this.setState({theme:theme==='light'?'dark':'light'})}><span><Icon name="sun" size={15}/></span><span><Icon name="moon" size={15}/></span><i style={{transform:theme==='dark'?'translateX(100%)':'translateX(0)'}}/></button>
          <a className="nav-cta" href="#contact">Записаться <Icon name="arrow" size={16}/></a>
        </div>
      </header>
      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy" data-reveal><div className="eyebrow"><span className="dot"/> Психологическая практика в Ярославле</div><h1>Место, где можно <em>не справляться в одиночку.</em></h1><p className="hero-lead">Помогаю разобраться в том, что тревожит, вернуть внутреннюю опору и принимать решения без постоянного давления на себя.</p><div className="hero-buttons"><a className="btn btn-primary" href="#contact">Записаться на встречу <Icon name="arrow" size={18}/></a><a className="text-link" href="#about">Познакомиться <span>↓</span></a></div><div className="hero-note"><Icon name="check" size={16}/> Конфиденциально · 50 минут · очно и онлайн</div></div>
          <div className="hero-art" data-reveal><div className="orb orb-a"/><div className="orb orb-b"/><div className="portrait-card"><div className="portrait-bg"><div className="portrait-circle"/><div className="portrait-line one"/><div className="portrait-line two"/><div className="portrait-face"><span/><span/></div><div className="portrait-hair"/></div><div className="portrait-caption"><strong>Бережно к сложному</strong><span>пространство без оценок</span></div></div><div className="float-card float-top"><Icon name="spark" size={18}/><span>опора начинается с честности</span></div><div className="float-card float-bottom"><span className="mini-ring"/> Онлайн · Ярославль</div></div>
        </section>
        <section className="marquee"><div className="marquee-track"><span>не нужно становиться другим человеком</span><b>✦</b><span>чтобы почувствовать себя лучше</span><b>✦</b><span>не нужно становиться другим человеком</span><b>✦</b></div></section>
        <section id="about" className="section wrap split"><div data-reveal><div className="kicker">01 / обо мне</div><h2>Вместе не ищем «правильного вас».</h2></div><div className="body-copy" data-reveal><p>Я Анна Лебедева, практикующий психолог. Работаю в бережном темпе, где можно остановиться, посмотреть на ситуацию со стороны и постепенно собрать собственную систему опоры.</p><p>В основе моей работы — уважение к вашему опыту, конфиденциальность и внимание к тому, что происходит именно с вами.</p><div className="facts"><span><b>8+</b> лет практики</span><span><b>1200+</b> встреч</span><span><b>очно / online</b> два формата</span></div></div></section>
        <section id="requests" className="section section-dark"><div className="wrap"><div className="kicker light">02 / с чем работаем</div><div className="request-grid">{requests.map(([n,t,d],i)=><article key={n} className="request-item" data-reveal style={{'--delay':i*90+'ms'}}><span className="request-n">{n}</span><div><h3>{t}</h3><p>{d}</p></div><span className="request-arrow">↗</span></article>)}</div></div></section>
        <section id="format" className="section wrap pricing"><div className="pricing-intro" data-reveal><div className="kicker">03 / формат</div><h2>Вы выбираете удобный способ.<br/><em>Содержание остаётся внимательным.</em></h2><p>Очно — в уютном кабинете в центре Ярославля. Онлайн — из любого места, где вам спокойно.</p></div><div className="price-card" data-reveal><div><span className="price-label">Индивидуальная консультация</span><strong>3 500 ₽</strong><span className="price-sub">50 минут · очно или онлайн</span></div><ul><li><Icon name="check" size={17}/> первая встреча без обязательств</li><li><Icon name="check" size={17}/> рекомендации между встречами</li><li><Icon name="check" size={17}/> безопасное пространство</li></ul><a className="btn btn-primary wide" href="#contact">Выбрать время <Icon name="arrow" size={17}/></a></div></section>
        <section className="section testimonials"><div className="wrap"><div className="kicker">04 / отзывы</div><div className="test-grid">{[['«Я впервые за долгое время перестала требовать от себя немедленно всё исправить. На консультациях появилось ощущение, что у меня есть выбор.»','Мария, 29 лет'],['«Очень спокойная и точная работа. Было легко говорить о вещах, которые раньше хотелось прятать даже от себя.»','Екатерина, 34 года'],['«Онлайн-формат оказался намного комфортнее, чем я ожидала. Через несколько встреч я уже заметил изменения в повседневности.»','Алексей, 31 год']].map((t,i)=><blockquote key={i} data-reveal style={{'--delay':i*100+'ms'}}><span className="quote-mark">“</span><p>{t[0]}</p><footer>{t[1]}</footer></blockquote>)}</div></div></section>
        <section id="faq" className="section wrap faq-sec"><div className="kicker">05 / часто спрашивают</div><div className="faq-list">{faqs.map(([q,a],i)=><div className={'faq-row '+(open===i?'open':'')} key={q} data-reveal><button onClick={()=>this.setState({open:open===i?null:i})}><span>{q}</span><b>{open===i?'−':'+'}</b></button><div className="faq-answer"><p>{a}</p></div></div>)}</div></section>
        <section id="contact" className="section contact wrap"><div className="contact-panel"><div className="contact-copy" data-reveal><div className="kicker light">06 / первая встреча</div><h2>Можно начать с одного сообщения.</h2><p>Расскажите в двух строках, что сейчас происходит. Я отвечу и предложу ближайшее время.</p><div className="contact-meta"><a href={'mailto:'+CONFIG.email}>{CONFIG.email}</a><a href={CONFIG.telegram}>Telegram ↗</a><span>{CONFIG.phone}</span><span><Icon name="pin" size={16}/> Ярославль, центр</span></div></div><form className="form" onSubmit={(e)=>this.submit(e)} data-reveal><label>Ваше имя<input required value={form.name} onChange={e=>this.setState({form:{...form,name:e.target.value}})} placeholder="Например, Анна"/></label><label>Как связаться<input required value={form.contact} onChange={e=>this.setState({form:{...form,contact:e.target.value}})} placeholder="Telegram или телефон"/></label><label>Что хотите обсудить? <textarea rows="4" value={form.request} onChange={e=>this.setState({form:{...form,request:e.target.value}})} placeholder="Можно совсем коротко…"/></label><button className="btn btn-light wide" type="submit">Отправить заявку <Icon name="arrow" size={18}/></button>{sent&&<div className="sent">Сообщение подготовлено в Telegram. Спасибо.</div>}<small>Нажимая кнопку, вы соглашаетесь на обработку данных для связи по заявке.</small></form></div></section>
      </main><footer className="footer"><div className="wrap footer-inner"><span>© 2026 {CONFIG.name}</span><span>Психологическая практика · Ярославль</span><a href="#top">Наверх ↑</a></div></footer>
    </div>;
  }
}
ReactDOM.render(React.createElement(App),document.getElementById('root'));
