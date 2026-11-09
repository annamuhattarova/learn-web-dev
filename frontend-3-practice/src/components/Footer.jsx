export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-block">
                    <h4 className="footer-logo">ПАРИКМАХЕРСКАЯ</h4>
                    <p className="footer-desc">Дружелюбное описание услуг</p>
                </div>
                <div className="footer-block">
                    <h4 className="footer-title">КОНТАКТЫ</h4>
                    <p>📍 ул. Садовая, 15, Москва</p>
                    <p>📞 +7 (495) 123-45-67</p>
                </div>
                <div className="footer-block">
                    <h4 className="footer-title">РЕЖИМ РАБОТЫ</h4>
                    <p>Пн–Пт: 9:00 – 21:00</p>
                    <p>Сб–Вс: 10:00 – 19:00</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026. Все права защищены.</p>
                <a href="#">Политика конфиденциальности</a>
            </div>
        </footer>
    );
}