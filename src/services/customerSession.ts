const activeCustomerKey = "orderops-active-customer-id";

type CustomerLike = {
  id: string;
};

export function getActiveCustomerId() {
  return window.localStorage.getItem(activeCustomerKey);
}

export function setActiveCustomerId(memberId: string) {
  window.localStorage.setItem(activeCustomerKey, memberId);
}

export function clearActiveCustomerId() {
  window.localStorage.removeItem(activeCustomerKey);
}

export function getActiveCustomer<T extends CustomerLike>(customers: T[]) {
  const activeId = getActiveCustomerId();
  return customers.find((customer) => customer.id === activeId) ?? null;
}
