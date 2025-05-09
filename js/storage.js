// Функция сохранения всех данных в localStorage
window.saveData = function() {
    try {
        // Сохраняем основные данные
        localStorage.setItem('appData', JSON.stringify(window.data));
        // Сохраняем текущий баланс
        localStorage.setItem('cash', window.cash);
        console.log('Данные успешно сохранены');
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
    }
};

// Функция сброса игры
window.resetGame = function() {
    if (!confirm('Вы уверены, что хотите начать новую игру? Все текущие данные будут удалены!')) {
        return;
    }
    
    // Полностью очищаем все данные
    window.data = {
        income: [],
        expense: [],
        asset: [],
        liability: [],
        children: [],
        history: [],
        monthsCount: 0
    };
    window.cash = 0;
    
    // Тщательная очистка localStorage
    localStorage.clear();
    localStorage.removeItem('appData');
    localStorage.removeItem('cash');
    localStorage.removeItem('data');
    
    // Сохраняем пустые данные в localStorage
    localStorage.setItem('appData', JSON.stringify(window.data));
    localStorage.setItem('cash', '0');
    
    // Очищаем все возможные кэши
    if (window.sessionStorage) {
        sessionStorage.clear();
    }
    
    // Показываем сообщение
    alert('Игра успешно сброшена. Страница будет перезагружена.');
    
    // Принудительно перезагружаем страницу без использования кэша
    window.location.href = window.location.pathname + '?clear=' + new Date().getTime();
};

// Функция загрузки данных из localStorage
window.loadData = function() {
    try {
        // Проверяем наличие параметров clear или nocache в URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('clear') || urlParams.has('nocache')) {
            // Если есть параметр clear или nocache, убеждаемся что все очищено
            localStorage.clear();
            window.data = {
                income: [],
                expense: [],
                asset: [],
                liability: [],
                children: [],
                history: [],
                monthsCount: 0
            };
            window.cash = 0;
            
            // Принудительно очищаем контейнер истории
            const historyContainer = document.getElementById('history-container');
            if (historyContainer) {
                historyContainer.innerHTML = '<div class="history-empty">История операций пуста</div>';
            }
            
            // Удаляем параметры из URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Обновляем отображение
            if (typeof window.renderAll === 'function') window.renderAll();
            if (typeof window.renderIncome === 'function') window.renderIncome();
            if (typeof window.renderExpense === 'function') window.renderExpense();
            if (typeof window.renderCash === 'function') window.renderCash();
            if (typeof window.renderSummary === 'function') window.renderSummary();
            if (typeof window.renderHistory === 'function') window.renderHistory();
            
            return;
        }
        
        // Загружаем основные данные
        const savedData = localStorage.getItem('appData');
        if (savedData) {
            window.data = JSON.parse(savedData);
            
            // Проверяем и инициализируем все необходимые массивы
            if (!Array.isArray(window.data.income)) window.data.income = [];
            if (!Array.isArray(window.data.expense)) window.data.expense = [];
            if (!Array.isArray(window.data.asset)) window.data.asset = [];
            if (!Array.isArray(window.data.liability)) window.data.liability = [];
            if (!Array.isArray(window.data.children)) window.data.children = [];
            if (!Array.isArray(window.data.history)) window.data.history = [];
            if (typeof window.data.monthsCount === 'undefined') window.data.monthsCount = 0;
        } else {
            // Инициализируем пустые данные если ничего не сохранено
            window.data = {
                income: [],
                expense: [],
                asset: [],
                liability: [],
                children: [],
                history: [],
                monthsCount: 0
            };
        }

        // Загружаем баланс
        const savedCash = localStorage.getItem('cash');
        window.cash = savedCash ? parseFloat(savedCash) : 0;

        // Обновляем все отображения
            if (typeof window.renderAll === 'function') window.renderAll();
            if (typeof window.renderIncome === 'function') window.renderIncome();
            if (typeof window.renderExpense === 'function') window.renderExpense();
            if (typeof window.renderCash === 'function') window.renderCash();
            if (typeof window.renderSummary === 'function') window.renderSummary();
        if (typeof window.renderHistory === 'function') window.renderHistory();
        
        console.log('Данные успешно загружены');
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        // В случае ошибки инициализируем пустые данные
        window.data = {
            income: [],
            expense: [],
            asset: [],
            liability: [],
            children: [],
            history: [],
            monthsCount: 0
        };
        window.cash = 0;
        
        // Принудительно очищаем контейнер истории
        const historyContainer = document.getElementById('history-container');
        if (historyContainer) {
            historyContainer.innerHTML = '<div class="history-empty">История операций пуста</div>';
        }
        
        // Обновляем отображение
        if (typeof window.renderAll === 'function') window.renderAll();
        if (typeof window.renderIncome === 'function') window.renderIncome();
        if (typeof window.renderExpense === 'function') window.renderExpense();
        if (typeof window.renderCash === 'function') window.renderCash();
        if (typeof window.renderSummary === 'function') window.renderSummary();
        if (typeof window.renderHistory === 'function') window.renderHistory();
    }
};

// Автоматическое сохранение данных при изменениях
window.autoSave = function() {
    window.saveData();
};

// Загружаем данные при запуске приложения
document.addEventListener('DOMContentLoaded', function() {
    window.loadData();
}); 