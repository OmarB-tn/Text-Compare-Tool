function compareText() {
    // 1. Grab the text from the text boxes
    const text1 = document.getElementById('text1').value;
    const text2 = document.getElementById('text2').value;

    // 2. Chop the text up into an array of words (and keep the spaces)
    const words1 = text1.split(/(\s+)/);
    const words2 = text2.split(/(\s+)/);

    // 3. Find the differences
    const { diff1, diff2 } = calculateDifferences(words1, words2);

    const resultBox1 = document.getElementById('result1');
    const resultBox2 = document.getElementById('result2');
    
    // 4. Turn those differences into HTML with colors
    resultBox1.innerHTML = createColoredHTML(diff1, 'deleted');
    resultBox2.innerHTML = createColoredHTML(diff2, 'added');

    // 5. Hide the text boxes and show the final results
    document.getElementById('text1').style.display = 'none';
    document.getElementById('text2').style.display = 'none';
    resultBox1.style.display = 'block';
    resultBox2.style.display = 'block';
}

// The engine that compares the two lists of words
function calculateDifferences(arr1, arr2) {
    const n = arr1.length;
    const m = arr2.length;
    
    // Create a grid to keep track of matching words
    const grid = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                grid[i][j] = grid[i - 1][j - 1] + 1;
            } else {
                grid[i][j] = Math.max(grid[i - 1][j], grid[i][j - 1]);
            }
        }
    }

    let i = n, j = m;
    const diff1 = [];
    const diff2 = [];

    // Walk backwards through the grid to mark what changed
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && arr1[i - 1] === arr2[j - 1]) {
            diff1.unshift({ value: arr1[i - 1], type: 'equal' });
            diff2.unshift({ value: arr2[j - 1], type: 'equal' });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || grid[i][j - 1] >= grid[i - 1][j])) {
            diff2.unshift({ value: arr2[j - 1], type: 'changed' });
            j--;
        } else if (i > 0 && (j === 0 || grid[i][j - 1] < grid[i - 1][j])) {
            diff1.unshift({ value: arr1[i - 1], type: 'changed' });
            i--;
        }
    }

    return { diff1, diff2 };
}

// Packages the text safely into HTML span elements
function createColoredHTML(diffArray, colorClass) {
    return diffArray.map(wordItem => {
        // Replace dangerous characters so the browser doesn't crash
        const safeText = wordItem.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        // If the word was changed (and isn't just a blank space), wrap it in color
        if (wordItem.type === 'changed' && !/^\s+$/.test(wordItem.value)) {
            return `<span class="${colorClass}">${safeText}</span>`;
        }
        return safeText;
    }).join('');
}

// Puts the tool back to its default state
function clearText() {
    document.getElementById('text1').value = '';
    document.getElementById('text2').value = '';
    
    document.getElementById('text1').style.display = 'block';
    document.getElementById('text2').style.display = 'block';
    
    document.getElementById('result1').style.display = 'none';
    document.getElementById('result2').style.display = 'none';
}