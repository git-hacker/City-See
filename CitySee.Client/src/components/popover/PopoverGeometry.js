
  export const computeGeometry =
    (contentSize, placement="auto", fromRect, displayArea, arrowSize) => {
    const effectiveArrowSize = getArrowSize(arrowSize, placement);
  
    switch (placement) {
      case 'top':
        return computeTopGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
      case 'bottom':
        return computeBottomGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
      case 'left':
        return computeLeftGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
      case 'right':
        return computeRightGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
      default:
        return computeAutoGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
    }
  };
  
  const getArrowSize = (size, placement="auto") => {
    if (placement === 'left' || placement === 'right') {
      return { width: size.height, height: size.width };
    }
    return size;
  };
  
  const computeTopGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
    const origin = {
      x: Math.min(
        displayArea.x + displayArea.width - contentSize.width,
        Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2),
      ),
      y: fromRect.y - contentSize.height - arrowSize.height,
    };
  
    const anchor = { x: fromRect.x + fromRect.width / 2, y: fromRect.y };
  
    return { origin, anchor, placement: 'top' };
  };
  
  const computeBottomGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
    const origin = {
      x: Math.min(
        displayArea.x + displayArea.width - contentSize.width,
        Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2),
      ),
      y: fromRect.y + fromRect.height + arrowSize.height,
    };
  
    const anchor = { x: fromRect.x + fromRect.width / 2, y: fromRect.y + fromRect.height };
  
    return { origin, anchor, placement: 'bottom' };
  };
  
  const computeLeftGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
    const origin = {
      x: fromRect.x - contentSize.width - arrowSize.width,
      y: Math.min(
        displayArea.y + displayArea.height - contentSize.height,
        Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2),
      ),
    };
  
    const anchor = { x: fromRect.x, y: fromRect.y + fromRect.height / 2 };
  
    return { origin, anchor, placement: 'left' };
  };
  
  const computeRightGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
    const origin = {
      x: fromRect.x + fromRect.width + arrowSize.width,
      y: Math.min(
        displayArea.y + displayArea.height - contentSize.height,
        Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2),
      ),
    };
  
    const anchor = { x: fromRect.x + fromRect.width, y: fromRect.y + fromRect.height / 2 };
  
    return { origin, anchor, placement: 'right' };
  };
  
  const computeAutoGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
    let geom = null;
    const placements = ['left', 'top', 'right', 'bottom'];
    for (let i = 0; i < 4; i += 1) {
      const placement = placements[i];
      geom = computeGeometry(contentSize, placement, fromRect, displayArea, arrowSize);
      const { origin } = geom;
  
      if (
        origin.x >= displayArea.x &&
        origin.x <= displayArea.x + displayArea.width - contentSize.width &&
        origin.y >= displayArea.y &&
        origin.y <= displayArea.y + displayArea.height - contentSize.height
      ) {
        break;
      }
    }
    return geom;
  };