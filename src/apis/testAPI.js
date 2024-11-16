import httpInstance from "@/utils/http";

export function getUsers() {
  return httpInstance({
    url:'/users'
  })
}
