// @ts-nocheck
import React from "react";
import { useTable, usePagination } from "react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  Box,
  Icon,
  HStack,
} from "@chakra-ui/react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const DefaultTable = ({
  renderPagination = true,
  columns,
  data = [],
  isLoading = false,
  pageAmount = 0,
  setSize,
  setPage,
}: any) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      pageCount: pageAmount,
      manualPagination: true,
    },
    usePagination
  );

  return (
    <Box overflow={"auto"}>
      <Table minH={data.length < 10 ? "auto" : 400} {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup: any, i: any) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column: any, index: any) => (
                <Th {...column.getHeaderProps()} key={index}>
                  {column.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row: any, index: any) => {
            prepareRow(row);
            return (
              <Tr
                _odd={{ bgColor: "gray.50" }}
                {...row.getRowProps()}
                key={index}
              >
                {row.cells.map((cell: any, i: any) => {
                  return (
                    <Td {...cell.getCellProps()} key={i}>
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {renderPagination && (
        <Flex m={4} alignItems="center" justifyContent="center">
          <Flex>
            <Tooltip label="Primeira página">
              <IconButton
                borderRadius={8}
                background="transparent"
                border="solid 1px #e1e6e9"
                onClick={() => {
                  gotoPage(0);

                  setPage(0);
                }}
                isDisabled={!canPreviousPage}
                icon={
                  <Icon
                    as={ChevronDoubleLeftIcon}
                    color="text.primary"
                    fontSize="18px"
                  />
                }
                mr={2}
              />
            </Tooltip>
            <Tooltip label="Página anterior">
              <IconButton
                borderRadius={8}
                background="transparent"
                border="solid 1px #e1e6e9"
                onClick={() => {
                  previousPage(pageIndex - 1);

                  setPage(pageIndex - 1);
                }}
                isDisabled={!canPreviousPage}
                icon={
                  <Icon
                    as={ChevronLeftIcon}
                    color="text.primary"
                    fontSize="18px"
                  />
                }
                mr={8}
              />
            </Tooltip>
          </Flex>

          <Flex>
            <HStack flexShrink={1} mr={4}>
              <Text fontSize="14px">Página</Text>
              <NumberInput
                w={"50px"}
                min={1}
                max={pageOptions.length}
                onChange={(value) => {
                  const page = value ? Number(value) - 1 : 0;
                  gotoPage(page);
                  setPage(page);
                }}
                defaultValue={pageIndex + 1}
                value={page[pageIndex + 1]?.index}
              >
                <NumberInputField fontWeight="bold" p={2} textAlign="center" />
              </NumberInput>

              {/* {console.log()} */}

              <Text fontSize="14px">de</Text>
              <Text fontWeight="bold">{pageOptions.length}</Text>
            </HStack>

            <Select
              fontSize="14px"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setSize(Number(e.target.value));
              }}
            >
              {[1, 10, 20, 30, 40, 50].map((pageSize) => (
                <option
                  style={{ background: "white" }}
                  key={pageSize}
                  value={pageSize}
                >
                  Mostrar {pageSize}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex>
            <Tooltip label="Próxima página">
              <IconButton
                ml={8}
                borderRadius={8}
                background="transparent"
                border="solid 1px #e1e6e9"
                onClick={() => {
                  nextPage();

                  setPage(pageIndex + 1);
                }}
                isDisabled={!canNextPage}
                icon={
                  <Icon
                    as={ChevronRightIcon}
                    color="text.primary"
                    fontSize="18px"
                  />
                }
              />
            </Tooltip>
            <Tooltip label="Última página">
              <IconButton
                borderRadius={8}
                background="transparent"
                border="solid 1px #e1e6e9"
                onClick={() => {
                  gotoPage(pageCount - 1);

                  setPage(pageCount - 1);
                }}
                isDisabled={!canNextPage}
                icon={
                  <Icon
                    as={ChevronDoubleRightIcon}
                    color="text.primary"
                    fontSize="18px"
                  />
                }
                ml={2}
              />
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default DefaultTable;
