const OPERATORS = {
  '+': { precedence: 2, associativity: 'left' },
  '-': { precedence: 2, associativity: 'left' },
  '*': { precedence: 3, associativity: 'left' },
  '/': { precedence: 3, associativity: 'left' },
  '%': { precedence: 3, associativity: 'left' },
  '^': { precedence: 4, associativity: 'right' },
};

const ALLOWED_CHARS = /^[0-9+\-*/%^().\s]+$/;

function sanitizeExpression(rawExpression) {
  if (typeof rawExpression !== 'string') return '';
  const trimmed = rawExpression.replace(/[^0-9+\-*/%^().\s]/g, '').trim();
  if (!trimmed || !ALLOWED_CHARS.test(trimmed)) {
    return '';
  }
  return trimmed.replace(/\s+/g, ' ');
}

function tokenize(expression) {
  const tokens = [];
  let numberBuffer = '';
  let lastToken = null;

  for (let i = 0; i < expression.length; i += 1) {
    const char = expression[i];

    if (char === ' ') continue;

    if (/^[0-9.]$/.test(char)) {
      numberBuffer += char;
      lastToken = null;
      continue;
    }

    if (char === '-' && (lastToken === null || OPERATORS[lastToken] || lastToken === '(')) {
      numberBuffer += char;
      continue;
    }

    if (OPERATORS[char] || char === '(' || char === ')') {
      if (numberBuffer) {
        if (numberBuffer === '-' || numberBuffer === '.') return null;
        tokens.push(numberBuffer);
        numberBuffer = '';
      }
      tokens.push(char);
      lastToken = char;
      continue;
    }

    return null;
  }

  if (numberBuffer) {
    if (numberBuffer === '-' || numberBuffer === '.') return null;
    tokens.push(numberBuffer);
  }

  return tokens;
}

function toPostfix(tokens) {
  if (!tokens || !tokens.length) return null;
  const output = [];
  const stack = [];

  for (const token of tokens) {
    if (!Number.isNaN(Number(token))) {
      output.push(token);
      continue;
    }

    if (OPERATORS[token]) {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (
          OPERATORS[top] &&
          ((OPERATORS[token].associativity === 'left' && OPERATORS[token].precedence <= OPERATORS[top].precedence) ||
            (OPERATORS[token].associativity === 'right' && OPERATORS[token].precedence < OPERATORS[top].precedence))
        ) {
          output.push(stack.pop());
        } else {
          break;
        }
      }
      stack.push(token);
      continue;
    }

    if (token === '(') {
      stack.push(token);
      continue;
    }

    if (token === ')') {
      let found = false;
      while (stack.length) {
        const op = stack.pop();
        if (op === '(') {
          found = true;
          break;
        }
        output.push(op);
      }
      if (!found) return null;
      continue;
    }

    return null;
  }

  while (stack.length) {
    const op = stack.pop();
    if (op === '(' || op === ')') return null;
    output.push(op);
  }

  return output;
}

function applyOperator(operator, a, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return null;
      return a / b;
    case '%':
      if (b === 0) return null;
      return a % b;
    case '^':
      return Math.pow(a, b);
    default:
      return null;
  }
}

function evaluatePostfix(postfix, collectSteps = false) {
  if (!postfix) return null;
  const stack = [];
  const steps = [];

  for (const token of postfix) {
    if (!Number.isNaN(Number(token))) {
      stack.push(Number(token));
      continue;
    }

    const b = stack.pop();
    const a = stack.pop();
    if (typeof a !== 'number' || typeof b !== 'number') return null;

    const result = applyOperator(token, a, b);
    if (typeof result !== 'number' || Number.isNaN(result) || !Number.isFinite(result)) {
      return null;
    }

    stack.push(result);

    if (collectSteps) {
      steps.push({
        expression: `${a} ${token} ${b}`,
        operation: token,
        result,
        description: `${a} ${token} ${b} = ${result}`,
      });
    }
  }

  if (stack.length !== 1) return null;
  return { result: stack[0], steps };
}

function formatNumber(value) {
  try {
    return new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 6 }).format(value);
  } catch (_) {
    return String(value);
  }
}

export function safeEval(expression) {
  const sanitized = sanitizeExpression(expression);
  if (!sanitized) return null;
  const tokens = tokenize(sanitized);
  const postfix = toPostfix(tokens);
  const evaluation = evaluatePostfix(postfix);
  if (!evaluation) return null;
  return evaluation.result;
}

export function calculateStepByStep(inputs) {
  const expressionInput = typeof inputs === 'string' ? inputs : inputs?.expression ?? '';
  const sanitized = sanitizeExpression(expressionInput);
  if (!sanitized) return null;
  const tokens = tokenize(sanitized);
  const postfix = toPostfix(tokens);
  const evaluation = evaluatePostfix(postfix, true);
  if (!evaluation) return null;
  const { result, steps } = evaluation;
  return {
    expression: sanitized,
    result,
    formattedResult: formatNumber(result),
    steps,
  };
}

export default {
  safeEval,
  calculateStepByStep,
};
